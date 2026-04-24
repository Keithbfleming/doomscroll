/**
 * Formats a duration in seconds to a human-readable string.
 * Shows hours when over 60 minutes, otherwise shows minutes and seconds.
 *
 * @param {number} sec - Total elapsed seconds.
 * @returns {string}
 */
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m >= 60) return `${Math.floor(m / 60)}h ${m % 60}m`;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

/**
 * 2×2 grid of session statistics: time spent, posts viewed, videos, and photos.
 *
 * @param {object} props
 * @param {object} props.session - Live session state from AppContext.
 * @param {number} props.session.elapsedSec - Seconds elapsed since session start.
 * @param {number} props.session.postCount - Total posts scrolled into view.
 * @param {number} props.session.videoCount - Subset of posts that are videos.
 * @param {number} props.session.photoCount - Subset of posts that are photos.
 */
export default function StatGrid({ session }) {
  const stats = [
    { label: 'Time spent',   value: formatTime(session.elapsedSec) },
    { label: 'Posts viewed', value: String(session.postCount) },
    { label: 'Videos',       value: String(session.videoCount) },
    { label: 'Photos',       value: String(session.photoCount) },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      {stats.map(s => (
        <div key={s.label} className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-1">{s.label}</p>
          <p className="text-xl font-bold text-gray-900">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
