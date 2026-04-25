import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { loadState, saveState, addSessionMinutes, setTodayMood } from '../lib/storage';

const AppContext = createContext(null);

/**
 * Demo speed multiplier — 1 = real time, >1 = compressed time for recorded demos.
 * Applied in the TICK reducer so all consumers (TimerBar, HealthIcon, opportunity
 * costs, end-session minute totals) inherit the sped-up clock automatically.
 * Set to 1 before shipping to real users.
 */
export const SPEED = 6;

/**
 * Screens the app can display.
 * 'homescreen' — fake iPhone home screen (used when user "closes" the app)
 * 'preSession'  — intention + balance check before opening the feed
 * 'feed'        — the main Instagram-style infinite scroll feed
 * 'dashboard'   — usage statistics and settings
 */

/**
 * Initial application state before localStorage is loaded.
 * persisted stays null until the LOAD action fires in AppProvider's useEffect.
 */
const INITIAL = {
  /** Active screen — drives the top-level Router in App.jsx */
  screen: 'preSession',
  /** Previous screen — used by GO_BACK to allow one-level back navigation */
  prevScreen: null,
  /** Loaded from localStorage; null until hydration is complete */
  persisted: null,
  /** Live session state — reset to defaults on each START_SESSION */
  session: {
    running: false,
    startTime: null,      // Date.now() snapshot when session started
    elapsedSec: 0,        // real seconds elapsed, computed from Date.now() delta to avoid drift
    postCount: 0,
    videoCount: 0,
    photoCount: 0,
    timeGoal: null,       // minutes (from modal or earnedBalance)
    mood: null,
  },
  showSessionPanel: false,
  showConfirmModal: false,
  intentions: [],
  customIntention: '',
};

/**
 * Pure reducer that handles all application state transitions.
 * Each case is annotated with its purpose.
 *
 * @param {object} state - Current state tree.
 * @param {object} action - Dispatched action with a `type` field.
 * @returns {object} Next state (always a new object — never mutated in-place).
 */
function reducer(state, action) {
  switch (action.type) {

    // Hydrate persisted state from localStorage on app boot
    case 'LOAD':
      return { ...state, persisted: action.payload };

    // Navigate to a named screen, recording the current one for GO_BACK
    case 'SET_SCREEN':
      return { ...state, screen: action.screen, prevScreen: state.screen };

    // Navigate back one level (falls back to preSession if no history)
    case 'GO_BACK':
      return { ...state, screen: state.prevScreen || 'preSession', prevScreen: null };

    // Toggle a preset intention chip on/off
    case 'TOGGLE_INTENTION': {
      const { val } = action;
      const has = state.intentions.includes(val);
      return {
        ...state,
        intentions: has
          ? state.intentions.filter(i => i !== val)
          : [...state.intentions, val],
      };
    }

    // Update the freeform custom intention text field
    case 'SET_CUSTOM':
      return { ...state, customIntention: action.val };

    // Show the pre-session confirmation modal
    case 'SHOW_CONFIRM':
      return { ...state, showConfirmModal: true };

    // Hide the pre-session confirmation modal (user cancelled)
    case 'HIDE_CONFIRM':
      return { ...state, showConfirmModal: false };

    // Transition to the feed and initialise session counters
    case 'START_SESSION':
      return {
        ...state,
        screen: 'feed',
        showConfirmModal: false,
        session: {
          ...state.session,
          running: true,
          startTime: Date.now(),
          elapsedSec: 0,
          postCount: 0,
          videoCount: 0,
          photoCount: 0,
          timeGoal: action.timeGoal,
          mood: null,
        },
        persisted: action.persisted,
      };

    // Advance the session clock — elapsed is recomputed from Date.now() delta,
    // not a simple counter, so background throttling or tab suspension won't cause drift.
    // Multiplied by SPEED to support sped-up demo recordings (SPEED=1 in production).
    case 'TICK':
      return {
        ...state,
        session: {
          ...state.session,
          elapsedSec: Math.floor(((Date.now() - state.session.startTime) / 1000) * SPEED),
        },
      };

    // Record a post being scrolled into view
    case 'POST_VIEWED': {
      const s = state.session;
      return {
        ...state,
        session: {
          ...s,
          postCount: s.postCount + 1,
          videoCount: s.videoCount + (action.isVideo ? 1 : 0),
          photoCount: s.photoCount + (action.isVideo ? 0 : 1),
        },
      };
    }

    // Toggle the slide-up session summary panel
    case 'TOGGLE_SESSION_PANEL':
      return { ...state, showSessionPanel: !state.showSessionPanel };

    // Close the session panel without ending the session
    case 'CLOSE_SESSION_PANEL':
      return { ...state, showSessionPanel: false };

    // Save the user's post-session mood and persist immediately
    case 'SET_MOOD': {
      const newPersisted = setTodayMood(state.persisted, action.mood);
      saveState(newPersisted); // mood is always persisted immediately
      return { ...state, session: { ...state.session, mood: action.mood }, persisted: newPersisted };
    }

    // Stop the running session; add elapsed minutes to today's total and persist
    case 'END_SESSION': {
      const minSpent = Math.floor(state.session.elapsedSec / 60);
      const newPersisted = addSessionMinutes(state.persisted, minSpent);
      saveState(newPersisted); // session end always persists usage data
      return {
        ...state,
        session: { ...state.session, running: false },
        persisted: newPersisted,
        showSessionPanel: false,
      };
    }

    // Legacy bulk-save (still used by some paths) — writes settings immediately
    case 'SAVE_SETTINGS': {
      const newPersisted = { ...state.persisted, ...action.settings };
      saveState(newPersisted);
      return { ...state, persisted: newPersisted };
    }

    // Update a single in-memory setting key — does NOT persist until COMMIT_SETTINGS
    case 'UPDATE_SETTING':
      return {
        ...state,
        persisted: { ...state.persisted, [action.key]: action.value },
      };

    // Explicit save triggered by the "Save Settings" button in SettingsPanel.
    // Only this action writes settings to localStorage — keeping changes
    // in-memory until the user confirms avoids accidental partial saves.
    case 'COMMIT_SETTINGS':
      saveState(state.persisted);
      return state;

    // Toggle an earning activity on/off and recalculate the earned balance
    case 'TOGGLE_ACTIVITY': {
      const acts = state.persisted.earningActivities.map(a =>
        a.id === action.id ? { ...a, enabled: !a.enabled } : a
      );
      const balance = acts.filter(a => a.enabled).reduce((s, a) => s + a.minutes, 0);
      const newPersisted = { ...state.persisted, earningActivities: acts, earnedBalance: balance };
      // Activity toggles persist immediately so the balance is always reflected
      saveState(newPersisted);
      return { ...state, persisted: newPersisted };
    }

    default:
      return state;
  }
}

/**
 * Provides global app state and dispatch to the component tree via AppContext.
 * Handles localStorage hydration and the session timer interval.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  // Ref holds the interval ID so we can clear it without a stale closure
  const intervalRef = useRef(null);

  // Hydrate persisted state from localStorage on mount
  useEffect(() => {
    const persisted = loadState();
    dispatch({ type: 'LOAD', payload: persisted });
  }, []);

  // Session timer: dedicated effect that watches only session.running.
  // Guarding against double-start prevents duplicate intervals if React
  // batches re-renders or StrictMode double-invokes effects in development.
  useEffect(() => {
    if (!state.session.running) {
      // Clear interval when the session stops
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Clear any stale interval before starting fresh (double-start guard)
    if (intervalRef.current) clearInterval(intervalRef.current);

    // setInterval fires TICK every second; elapsed is computed from Date.now()
    // delta inside the reducer rather than incremented as a counter, so the
    // timer stays accurate even when the tab is throttled or suspended.
    intervalRef.current = setInterval(() => {
      dispatch({ type: 'TICK', now: Date.now() });
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [state.session.running]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * Convenience hook for consuming the AppContext.
 * Throws if used outside of an AppProvider.
 *
 * @returns {{ state: object, dispatch: function }}
 */
export function useApp() {
  return useContext(AppContext);
}
