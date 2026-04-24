import { useApp } from '../../context/AppContext';

/**
 * Card showing at-a-glance session statistics: longest session, total count, and average length.
 * Reads the live session from AppContext so in-progress time is included in the calculations.
 *
 * @param {object} props
 * @param {Array<{day: string, mins: number, mood: number, posts: number}>} props.sessionHistory
 *   Past session records from persisted state.
 */
export default function SessionHighlights({ sessionHistory }) {
  const { state } = useApp();
  const { session } = state;

  // Include the current running session in the stats if it has elapsed time
  const liveMins = Math.floor(session.elapsedSec / 60);
  const sessionCount = sessionHistory.length + (session.elapsedSec > 0 ? 1 : 0);
  const longestSession = Math.max(
    ...sessionHistory.map(s => s.mins),
    liveMins,
    0
  );
  const avgSession = sessionHistory.length
    ? Math.round(sessionHistory.reduce((a, s) => a + s.mins, 0) / sessionHistory.length)
    : 0;

  const highlights = [
    { label: 'Longest', value: `${longestSession}m` },
    { label: 'Sessions', value: String(sessionCount) },
    { label: 'Avg',     value: `${avgSession}m` },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100">
      <p className="text-sm font-semibold text-gray-900 mb-4">Session Highlights</p>
      <div className="grid grid-cols-3 gap-3">
        {highlights.map(h => (
          <div key={h.label} className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-gray-900">{h.value}</p>
            <p className="text-[11px] text-gray-400">{h.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
