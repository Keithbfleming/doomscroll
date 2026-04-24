import { useApp } from '../context/AppContext';
import { StatGrid } from '../components/session';
import { OpportunityCosts } from '../components/session';
import { MoodPicker } from '../components/session';

/**
 * Slide-up bottom sheet showing live session stats, opportunity costs,
 * a mood picker, and action buttons.
 * Rendered absolutely inside the feed view — uses `position: absolute` not `fixed`
 * so it stays within the phone-frame overflow:hidden boundary.
 *
 * @param {object} props
 * @param {function} props.onClose - Dismisses the panel (returns to feed).
 * @param {function} props.onBreak - Closes the panel and starts a mental break.
 * @param {function} props.onDashboard - Ends the session and navigates to the dashboard.
 */
export default function SessionPanel({ onClose, onBreak, onDashboard }) {
  const { state, dispatch } = useApp();
  const { session } = state;

  /**
   * Handles mood selection — dispatches SET_MOOD which also persists to localStorage.
   *
   * @param {number} score - Mood score 1–5.
   */
  function handleMood(score) {
    dispatch({ type: 'SET_MOOD', mood: score });
  }

  return (
    // absolute (not fixed) — must stay inside the phone-frame overflow:hidden container
    <div className="absolute inset-0 z-40 flex flex-col justify-end fade-in">
      {/* Backdrop — tapping closes the panel */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-t-3xl max-h-[85%] overflow-y-auto scrollbar-hide slide-up">
        {/* Sticky handle bar and title */}
        <div className="sticky top-0 bg-white pt-3 pb-2 flex flex-col items-center border-b border-gray-100 z-10">
          <div className="w-10 h-1 bg-gray-300 rounded-full mb-2" />
          <div className="flex items-center justify-between w-full px-5">
            <h2 className="text-base font-semibold text-gray-900">Session Summary</h2>
            <button onClick={onClose} className="text-gray-400 p-1" aria-label="Close session panel">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-5 pt-4 pb-8">
          {/* 2×2 stats grid */}
          <StatGrid session={session} />

          {/* Distance scrolled + time metaphor */}
          <OpportunityCosts session={session} />

          {/* 5-emoji mood picker */}
          <MoodPicker
            currentMood={session.mood}
            onSelect={handleMood}
          />

          {/* Action buttons */}
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
