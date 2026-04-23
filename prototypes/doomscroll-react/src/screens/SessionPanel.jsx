import { useApp } from '../context/AppContext';

const MOODS = [
  { score: 1, emoji: '😞', label: 'Not great', bg: '#fde8ea' },
  { score: 2, emoji: '😕', label: 'Meh',       bg: '#fff0e0' },
  { score: 3, emoji: '😐', label: 'Okay',       bg: '#fffbea' },
  { score: 4, emoji: '🙂', label: 'Good',       bg: '#e0f7ff' },
  { score: 5, emoji: '😄', label: 'Great',      bg: '#e0faf3' },
];

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m >= 60) return `${Math.floor(m/60)}h ${m%60}m`;
  return `${m}m ${String(s).padStart(2,'0')}s`;
}

function scrollFeet(posts) {
  return posts * 9;
}

function timeMetaphor(mins) {
  if (mins < 5)  return 'read a couple pages of a book';
  if (mins < 10) return 'do a guided breathing exercise';
  if (mins < 20) return 'read a full chapter of a novel';
  if (mins < 30) return 'listen to a full album';
  if (mins < 45) return 'listen to a podcast episode';
  if (mins < 60) return 'go for a bike ride';
  return 'watch an entire movie';
}

function distanceMetaphor(feet) {
  if (feet < 100) return `length of a few parked cars`;
  if (feet < 528) return `${Math.round(feet / 3)} yards — a city block`;
  return `${(feet / 5280).toFixed(1)} miles`;
}

export default function SessionPanel({ onClose, onBreak, onDashboard }) {
  const { state, dispatch } = useApp();
  const { session } = state;
  const mins = Math.floor(session.elapsedSec / 60);
  const feet = scrollFeet(session.postCount);

  function handleMood(score) {
    dispatch({ type: 'SET_MOOD', mood: score });
  }

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end fade-in">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl max-h-[85%] overflow-y-auto scrollbar-hide slide-up">
        {/* Handle */}
        <div className="sticky top-0 bg-white pt-3 pb-2 flex flex-col items-center border-b border-gray-100 z-10">
          <div className="w-10 h-1 bg-gray-300 rounded-full mb-2" />
          <div className="flex items-center justify-between w-full px-5">
            <h2 className="text-base font-semibold text-gray-900">Session Summary</h2>
            <button onClick={onClose} className="text-gray-400 p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-5 pt-4 pb-8">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: 'Time spent', value: formatTime(session.elapsedSec) },
              { label: 'Posts viewed', value: String(session.postCount) },
              { label: 'Videos', value: String(session.videoCount) },
              { label: 'Photos', value: String(session.photoCount) },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Opportunity costs */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-amber-50 rounded-xl p-3">
              <p className="text-xs text-amber-700 font-medium mb-1">📏 Distance scrolled</p>
              <p className="text-sm font-bold text-amber-900">{feet < 5280 ? `${feet} ft` : `${(feet/5280).toFixed(1)} mi`}</p>
              <p className="text-xs text-amber-600 mt-1">{distanceMetaphor(feet)}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3">
              <p className="text-xs text-purple-700 font-medium mb-1">⏱ Instead you could've</p>
              <p className="text-xs font-semibold text-purple-900 leading-snug">{timeMetaphor(mins)}</p>
            </div>
          </div>

          {/* Mood check */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">How are you feeling?</p>
            <div className="flex justify-between gap-1">
              {MOODS.map(m => (
                <button
                  key={m.score}
                  onClick={() => handleMood(m.score)}
                  className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all"
                  style={{
                    backgroundColor: session.mood === m.score ? m.bg : '#f9fafb',
                    border: `2px solid ${session.mood === m.score ? '#3B82F6' : 'transparent'}`,
                    transform: session.mood === m.score ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-[10px] text-gray-500 leading-tight text-center">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onBreak}
              className="w-full py-3.5 rounded-2xl bg-gray-100 text-gray-700 font-semibold text-sm"
            >
              🧘 Take Mental Health Break
            </button>
            <button
              onClick={onDashboard}
              className="w-full py-3.5 rounded-2xl bg-blue-500 text-white font-semibold text-sm"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
