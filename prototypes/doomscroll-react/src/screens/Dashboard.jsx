import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DAY_NAMES } from '../lib/mockData';

const MOOD_COLORS = ['', '#fde8ea', '#fff0e0', '#fffbea', '#e0f7ff', '#e0faf3'];
const MOOD_EMOJI  = ['', '😞', '😕', '😐', '🙂', '😄'];

// Weekly bar chart
function WeeklyChart({ data, goal }) {
  const maxVal = Math.max(...data, 1);
  const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  return (
    <div className="flex items-end justify-between gap-1.5 h-20">
      {data.map((val, i) => {
        const isToday = i === today;
        const overGoal = val > (goal / 7);
        const heightPct = val === 0 ? 4 : Math.max(8, (val / maxVal) * 100);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end" style={{ height: 68 }}>
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  height: `${heightPct}%`,
                  backgroundColor: isToday ? '#3B82F6' : overGoal ? '#ef4444' : '#d1d5db',
                }}
              />
            </div>
            <span className={`text-[10px] font-medium ${isToday ? 'text-blue-500' : 'text-gray-400'}`}>
              {DAY_NAMES[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Goal ring
function GoalRing({ used, goal }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(used / goal, 1);
  const color = pct >= 1 ? '#ef4444' : '#3B82F6';
  return (
    <svg viewBox="0 0 96 96" className="w-24 h-24">
      <circle cx="48" cy="48" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
      <circle
        cx="48" cy="48" r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round"
        transform="rotate(-90 48 48)"
      />
      <text x="48" y="44" textAnchor="middle" className="text-xs" fontSize="13" fontWeight="700" fill="#111827">
        {Math.round(pct * 100)}%
      </text>
      <text x="48" y="57" textAnchor="middle" fontSize="9" fill="#9ca3af">of goal</text>
    </svg>
  );
}

// Donut chart
function DonutChart({ videos, photos }) {
  const total = videos + photos || 1;
  const vPct = videos / total;
  const r = 32;
  const circ = 2 * Math.PI * r;
  const vDash = circ * vPct;
  return (
    <svg viewBox="0 0 80 80" className="w-20 h-20">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#f09433" strokeWidth="12" />
      <circle
        cx="40" cy="40" r={r}
        fill="none"
        stroke="#0095f6"
        strokeWidth="12"
        strokeDasharray={`${vDash} ${circ}`}
        transform="rotate(-90 40 40)"
      />
      <text x="40" y="44" textAnchor="middle" fontSize="11" fontWeight="700" fill="#111827">{total}</text>
    </svg>
  );
}

// Toggle switch
function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-green-500' : 'bg-gray-300'}`}
    >
      <span
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
        style={{ left: value ? '26px' : '2px' }}
      />
    </button>
  );
}

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const { persisted, session, prevScreen } = state;
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [goalInput, setGoalInput] = useState(persisted?.weeklyGoal ?? 120);

  if (!persisted) return null;

  const {
    weeklyData, moodHistory, weeklyGoal, enablePreSession, enableOverlay,
    earningActivities, sessionHistory,
  } = persisted;

  const totalWeekMins = weeklyData.reduce((a, b) => a + b, 0);
  const sessionCount = sessionHistory.length + (session.elapsedSec > 0 ? 1 : 0);
  const longestSession = Math.max(...sessionHistory.map(s => s.mins), Math.floor(session.elapsedSec / 60));
  const avgSession = sessionHistory.length
    ? Math.round(sessionHistory.reduce((a, s) => a + s.mins, 0) / sessionHistory.length)
    : 0;

  const totalPosts = session.postCount + sessionHistory.reduce((a, s) => a + (s.posts || 0), 0);
  const videoPosts = Math.round(totalPosts * 0.5);
  const photoPosts = totalPosts - videoPosts;

  function saveSettings() {
    dispatch({
      type: 'SAVE_SETTINGS',
      settings: { weeklyGoal: goalInput, enablePreSession, enableOverlay },
    });
  }

  function handleBack() {
    if (prevScreen === 'feed') {
      dispatch({ type: 'GO_BACK' });
    } else {
      dispatch({ type: 'SET_SCREEN', screen: 'preSession' });
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#fafafa]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4 bg-white border-b border-gray-200">
        <button onClick={handleBack} className="text-blue-500 flex items-center gap-1 text-sm font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="text-lg font-bold text-gray-900 flex-1">Dashboard</h1>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-10">

        {/* Settings section */}
        <div className="bg-white border-b border-gray-200">
          <button
            onClick={() => setSettingsOpen(o => !o)}
            className="w-full flex items-center justify-between px-5 py-4"
          >
            <span className="font-semibold text-gray-900 text-sm">⚙️  Settings</span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${settingsOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {settingsOpen && (
            <div className="px-5 pb-5 space-y-4 border-t border-gray-100">
              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="text-sm font-medium text-gray-800">Pre-session nudge</p>
                  <p className="text-xs text-gray-400">Set intentions before opening Instagram</p>
                </div>
                <Toggle
                  value={enablePreSession}
                  onChange={v => dispatch({ type: 'SAVE_SETTINGS', settings: { enablePreSession: v } })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">In-session overlay</p>
                  <p className="text-xs text-gray-400">Show timer and health status while browsing</p>
                </div>
                <Toggle
                  value={enableOverlay}
                  onChange={v => dispatch({ type: 'SAVE_SETTINGS', settings: { enableOverlay: v } })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Weekly goal</p>
                  <p className="text-xs text-gray-400">Total minutes per week</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setGoalInput(g => Math.max(15, g - 15))}
                    className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold"
                  >−</button>
                  <span className="text-sm font-semibold w-10 text-center">{goalInput}</span>
                  <button
                    onClick={() => setGoalInput(g => Math.min(600, g + 15))}
                    className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold"
                  >+</button>
                </div>
              </div>
              <button
                onClick={saveSettings}
                className="w-full py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold"
              >
                Save Settings
              </button>

              {/* Activity toggles */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Earning Activities</p>
                <div className="space-y-2">
                  {earningActivities.map(a => (
                    <div key={a.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-800">{a.label}</p>
                        <p className="text-xs text-gray-400">{a.detail} · +{a.minutes} min</p>
                      </div>
                      <Toggle
                        value={a.enabled}
                        onChange={() => dispatch({ type: 'TOGGLE_ACTIVITY', id: a.id })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 pt-5 space-y-5">

          {/* Weekly usage chart */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">Weekly Usage</p>
                <p className="text-xs text-gray-400">{totalWeekMins} min this week</p>
              </div>
              <GoalRing used={totalWeekMins} goal={weeklyGoal} />
            </div>
            <WeeklyChart data={weeklyData} goal={weeklyGoal} />
            <div className="flex items-center gap-2 mt-3">
              <div className="w-2.5 h-2.5 rounded bg-blue-500" />
              <span className="text-[11px] text-gray-400">Today</span>
              <div className="w-2.5 h-2.5 rounded bg-gray-300 ml-3" />
              <span className="text-[11px] text-gray-400">Past days</span>
              <div className="w-2.5 h-2.5 rounded bg-red-400 ml-3" />
              <span className="text-[11px] text-gray-400">Over daily avg</span>
            </div>
          </div>

          {/* Mood history */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="text-sm font-semibold text-gray-900 mb-3">Mood This Week</p>
            <div className="flex gap-2">
              {DAY_NAMES.map((day, i) => {
                const mood = moodHistory[i];
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                      style={{ backgroundColor: mood ? MOOD_COLORS[mood] : '#f3f4f6' }}
                    >
                      {mood ? MOOD_EMOJI[mood] : <span className="text-xs text-gray-300">?</span>}
                    </div>
                    <span className="text-[10px] text-gray-400">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Session highlights */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="text-sm font-semibold text-gray-900 mb-4">Session Highlights</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Longest', value: `${longestSession}m` },
                { label: 'Sessions', value: String(sessionCount) },
                { label: 'Avg', value: `${avgSession}m` },
              ].map(h => (
                <div key={h.label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{h.value}</p>
                  <p className="text-[11px] text-gray-400">{h.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Content breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="text-sm font-semibold text-gray-900 mb-4">Content Breakdown</p>
            <div className="flex items-center gap-5">
              <DonutChart videos={videoPosts} photos={photoPosts} />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#0095f6]" />
                  <span className="text-sm text-gray-700">Videos</span>
                  <span className="ml-auto text-sm font-semibold text-gray-900">{videoPosts}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#f09433]" />
                  <span className="text-sm text-gray-700">Photos</span>
                  <span className="ml-auto text-sm font-semibold text-gray-900">{photoPosts}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400">Avg video watch time</p>
                  <p className="text-sm font-semibold text-gray-800">~12s</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content tags */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="text-sm font-semibold text-gray-900 mb-4">Top Content Categories</p>
            {[
              { tag: 'Lifestyle', pct: 34 },
              { tag: 'Travel', pct: 22 },
              { tag: 'Food', pct: 18 },
              { tag: 'Fitness', pct: 14 },
              { tag: 'Art', pct: 12 },
            ].map(t => (
              <div key={t.tag} className="flex items-center gap-3 mb-2">
                <span className="text-xs text-gray-600 w-16">{t.tag}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: `${t.pct}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-8 text-right">{t.pct}%</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
