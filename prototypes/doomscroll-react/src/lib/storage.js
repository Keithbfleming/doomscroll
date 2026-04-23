const KEY = 'doomscroll_v1';

function getTodayIndex() {
  return new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; // 0=Mon
}

const SEED_DATA = {
  earnedBalance: 12,
  earningActivities: [
    { id: 'steps',     label: 'Steps',           detail: '2,400 steps', minutes: 5,  enabled: true },
    { id: 'active',    label: 'Active Minutes',   detail: '18 min',     minutes: 5,  enabled: true },
    { id: 'mindful',   label: 'Mindfulness',      detail: '10 min',     minutes: 2,  enabled: true },
    { id: 'cooking',   label: 'Cooking',          detail: '30 min',     minutes: 5,  enabled: false },
    { id: 'reading',   label: 'Reading',          detail: '20 min',     minutes: 4,  enabled: false },
    { id: 'writing',   label: 'Writing',          detail: '15 min',     minutes: 3,  enabled: false },
    { id: 'calling',   label: 'Phone a friend',   detail: '10 min',     minutes: 5,  enabled: false },
    { id: 'nap',       label: 'Nap',              detail: '20 min',     minutes: 5,  enabled: false },
  ],
  weeklyGoal: 120,
  enablePreSession: true,
  enableOverlay: true,
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

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  saveState(SEED_DATA);
  return SEED_DATA;
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (_) {}
}

export function resetToday(state) {
  return { ...state, todayMins: 0, todayMood: null };
}

export function addSessionMinutes(state, mins) {
  const todayMins = (state.todayMins || 0) + mins;
  const weeklyData = [...state.weeklyData];
  weeklyData[getTodayIndex()] = todayMins;
  return { ...state, todayMins, weeklyData };
}

export function setTodayMood(state, mood) {
  const moodHistory = [...state.moodHistory];
  moodHistory[getTodayIndex()] = mood;
  return { ...state, todayMood: mood, moodHistory };
}
