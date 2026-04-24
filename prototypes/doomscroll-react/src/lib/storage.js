/** localStorage key used for all persisted state. */
const KEY = 'doomscroll_v1';

/**
 * Returns the index of today in a Mon–Sun week (0 = Monday, 6 = Sunday).
 * JavaScript's getDay() returns 0 for Sunday, so we remap it to the end.
 *
 * @returns {number} 0–6
 */
export function getTodayIndex() {
  return new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
}

/**
 * Default seed data written to localStorage on first launch.
 * All new persisted keys must have defaults here so existing users get them
 * via the migration block in loadState().
 *
 * Shape notes:
 *  - weeklyData: 7 numbers (Mon–Sun), minutes used per day
 *  - moodHistory: 7 values (1–5 | null), mood score after each session
 *  - sessionHistory: array of past session summaries used by the dashboard
 *  - enableTimerBar: show/hide the in-session countdown bar (split from enableOverlay)
 *  - enableHealthIcon: show/hide the floating health icon (split from enableOverlay)
 *  - mentalBreakMins: configurable duration for the mental break countdown
 */
const SEED_DATA = {
  earnedBalance: 12,
  earningActivities: [
    { id: 'steps',   label: 'Steps',         detail: '2,400 steps', minutes: 5, enabled: true  },
    { id: 'active',  label: 'Active Minutes', detail: '18 min',      minutes: 5, enabled: true  },
    { id: 'mindful', label: 'Mindfulness',    detail: '10 min',      minutes: 2, enabled: true  },
    { id: 'cooking', label: 'Cooking',        detail: '30 min',      minutes: 5, enabled: false },
    { id: 'reading', label: 'Reading',        detail: '20 min',      minutes: 4, enabled: false },
    { id: 'writing', label: 'Writing',        detail: '15 min',      minutes: 3, enabled: false },
    { id: 'calling', label: 'Phone a friend', detail: '10 min',      minutes: 5, enabled: false },
    { id: 'nap',     label: 'Nap',            detail: '20 min',      minutes: 5, enabled: false },
  ],
  weeklyGoal: 120,
  enablePreSession: true,
  // Legacy master overlay toggle — kept for backward-compat; new code uses the split flags below
  enableOverlay: true,
  // Split overlay flags (Fix 5): lets users hide the timer while keeping the health icon
  enableTimerBar: true,
  enableHealthIcon: true,
  // Configurable break duration in minutes (Fix 2 / Fix 5)
  mentalBreakMins: 5,
  weeklyData: [38, 52, 19, 64, 28, 41, 0],
  moodHistory: [3, 4, 2, 5, 3, 4, null],
  sessionHistory: [
    { day: 'Mon', mins: 38, mood: 3, posts: 42 },
    { day: 'Tue', mins: 52, mood: 4, posts: 61 },
    { day: 'Wed', mins: 19, mood: 2, posts: 21 },
    { day: 'Thu', mins: 64, mood: 5, posts: 78 },
    { day: 'Fri', mins: 28, mood: 3, posts: 33 },
    { day: 'Sat', mins: 41, mood: 4, posts: 50 },
  ],
  todayMins: 0,
  todayMood: null,
  lastIntention: null,
  sessionTimeGoal: null,
};

/**
 * Loads persisted state from localStorage.
 * Falls back to SEED_DATA on first run or after a corrupted write.
 * Runs a migration pass to backfill any keys added after the user's
 * data was first seeded — keeps old users compatible without a hard reset.
 *
 * @returns {object} The full persisted state object.
 */
export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);

      // Migrate old single enableOverlay into the two split toggles
      if (parsed.enableTimerBar === undefined) {
        parsed.enableTimerBar = parsed.enableOverlay ?? true;
      }
      if (parsed.enableHealthIcon === undefined) {
        parsed.enableHealthIcon = parsed.enableOverlay ?? true;
      }
      if (parsed.mentalBreakMins === undefined) {
        parsed.mentalBreakMins = 5;
      }

      return parsed;
    }
  } catch (_) {
    // Swallow parse errors and fall through to seed
  }
  saveState(SEED_DATA);
  return SEED_DATA;
}

/**
 * Persists the full state object to localStorage.
 * Swallows storage errors silently (e.g. private mode quota exceeded).
 *
 * @param {object} state - The full persisted state to save.
 */
export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (_) {
    // Private browsing or quota exceeded — continue in-memory only
  }
}

/**
 * Returns a copy of state with today's usage reset to zero.
 * Called at day-boundary transitions (not yet wired to a cron; called manually).
 *
 * @param {object} state
 * @returns {object}
 */
export function resetToday(state) {
  return { ...state, todayMins: 0, todayMood: null };
}

/**
 * Adds minutes to today's usage total and updates the matching weeklyData slot.
 * Does NOT save to localStorage — caller is responsible for persisting.
 *
 * @param {object} state - Current persisted state.
 * @param {number} mins - Minutes to add.
 * @returns {object} Updated state (immutable copy).
 */
export function addSessionMinutes(state, mins) {
  const todayMins = (state.todayMins || 0) + mins;
  const weeklyData = [...state.weeklyData];
  weeklyData[getTodayIndex()] = todayMins;
  return { ...state, todayMins, weeklyData };
}

/**
 * Records the user's mood for today and updates the moodHistory array.
 * Does NOT save to localStorage — caller is responsible for persisting.
 *
 * @param {object} state - Current persisted state.
 * @param {number} mood - Mood score 1–5.
 * @returns {object} Updated state (immutable copy).
 */
export function setTodayMood(state, mood) {
  const moodHistory = [...state.moodHistory];
  moodHistory[getTodayIndex()] = mood;
  return { ...state, todayMood: mood, moodHistory };
}
