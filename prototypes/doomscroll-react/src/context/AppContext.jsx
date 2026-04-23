import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { loadState, saveState, addSessionMinutes, setTodayMood } from '../lib/storage';

const AppContext = createContext(null);

// Screens: 'preSession' | 'feed' | 'dashboard' | 'mentalBreak'
const INITIAL = {
  screen: 'preSession',
  prevScreen: null,
  persisted: null,          // loaded from localStorage
  session: {
    running: false,
    startTime: null,        // Date.now() when session started
    elapsedSec: 0,          // real seconds elapsed
    postCount: 0,
    videoCount: 0,
    photoCount: 0,
    timeGoal: null,         // minutes (from modal or earnedBalance)
    mood: null,
  },
  showSessionPanel: false,
  showConfirmModal: false,
  intentions: [],
  customIntention: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return { ...state, persisted: action.payload };
    case 'SET_SCREEN':
      return { ...state, screen: action.screen, prevScreen: state.screen };
    case 'GO_BACK':
      return { ...state, screen: state.prevScreen || 'preSession', prevScreen: null };
    case 'TOGGLE_INTENTION': {
      const { val } = action;
      const has = state.intentions.includes(val);
      return { ...state, intentions: has ? state.intentions.filter(i => i !== val) : [...state.intentions, val] };
    }
    case 'SET_CUSTOM':
      return { ...state, customIntention: action.val };
    case 'SHOW_CONFIRM':
      return { ...state, showConfirmModal: true };
    case 'HIDE_CONFIRM':
      return { ...state, showConfirmModal: false };
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
    case 'TICK':
      return { ...state, session: { ...state.session, elapsedSec: action.elapsed } };
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
    case 'TOGGLE_SESSION_PANEL':
      return { ...state, showSessionPanel: !state.showSessionPanel };
    case 'CLOSE_SESSION_PANEL':
      return { ...state, showSessionPanel: false };
    case 'SET_MOOD': {
      const newPersisted = setTodayMood(state.persisted, action.mood);
      saveState(newPersisted);
      return { ...state, session: { ...state.session, mood: action.mood }, persisted: newPersisted };
    }
    case 'END_SESSION': {
      const minSpent = Math.floor(state.session.elapsedSec / 60);
      const newPersisted = addSessionMinutes(state.persisted, minSpent);
      saveState(newPersisted);
      return {
        ...state,
        session: { ...state.session, running: false },
        persisted: newPersisted,
        showSessionPanel: false,
      };
    }
    case 'SAVE_SETTINGS': {
      const newPersisted = { ...state.persisted, ...action.settings };
      saveState(newPersisted);
      return { ...state, persisted: newPersisted };
    }
    case 'TOGGLE_ACTIVITY': {
      const acts = state.persisted.earningActivities.map(a =>
        a.id === action.id ? { ...a, enabled: !a.enabled } : a
      );
      const balance = acts.filter(a => a.enabled).reduce((s, a) => s + a.minutes, 0);
      const newPersisted = { ...state.persisted, earningActivities: acts, earnedBalance: balance };
      saveState(newPersisted);
      return { ...state, persisted: newPersisted };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const tickRef = useRef(null);

  useEffect(() => {
    const persisted = loadState();
    dispatch({ type: 'LOAD', payload: persisted });
  }, []);

  // Session timer tick (real-time, 1s intervals)
  useEffect(() => {
    if (state.session.running) {
      tickRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - state.session.startTime) / 1000);
        dispatch({ type: 'TICK', elapsed });
      }, 1000);
    } else {
      clearInterval(tickRef.current);
    }
    return () => clearInterval(tickRef.current);
  }, [state.session.running, state.session.startTime]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
