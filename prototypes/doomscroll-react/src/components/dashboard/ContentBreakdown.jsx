import { useApp } from '../../context/AppContext';

/**
 * Donut chart private to this file — only used by ContentBreakdown.
 * Shows the video/photo split as a proportional arc overlay.
 *
 * @param {object} props
 * @param {number} props.videos - Video post count.
 * @param {number} props.photos - Photo post count.
 */
function DonutChart({ videos, photos }) {
  const total = videos + photos || 1; // guard against divide-by-zero
  const vPct = videos / total;
  const r = 32;
  const circ = 2 * Math.PI * r;
  const vDash = circ * vPct;

  return (
    <svg viewBox="0 0 80 80" className="w-20 h-20">
      {/* Photo (orange) fills the full circle as background */}
      <circle cx="40" cy="40" r={r} fill="none" stroke="#f09433" strokeWidth="12" />
      {/* Video (blue) arc overlaid, starting from the top */}
      <circle
        cx="40" cy="40" r={r}
        fill="none"
        stroke="#0095f6"
        strokeWidth="12"
        strokeDasharray={`${vDash} ${circ}`}
        transform="rotate(-90 40 40)"
      />
      {/* Total post count in the centre */}
      <text x="40" y="44" textAnchor="middle" fontSize="11" fontWeight="700" fill="#111827">
        {total}
      </text>
    </svg>
  );
}

/**
 * Card showing the video/photo content breakdown for all sessions this week.
 * Includes the DonutChart and bar-style category breakdown.
 * Reads the live session post counts from AppContext to keep totals current.
 *
 * @param {object} props
 * @param {Array<{posts: number}>} props.sessionHistory - Past session records.
 */
export default function ContentBreakdown({ sessionHistory }) {
  const { state } = useApp();
  const { session } = state;

  const totalPosts = session.postCount + sessionHistory.reduce((a, s) => a + (s.posts || 0), 0);
  // Simple 50/50 heuristic — real split would come from per-session video/photo tracking
  const videoPosts = Math.round(totalPosts * 0.5);
  const photoPosts = totalPosts - videoPosts;

  const categories = [
    { tag: 'Lifestyle', pct: 34 },
    { tag: 'Travel',    pct: 22 },
    { tag: 'Food',      pct: 18 },
    { tag: 'Fitness',   pct: 14 },
    { tag: 'Art',       pct: 12 },
  ];

  return (
    <>
      {/* Video vs Photo donut */}
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

      {/* Top content categories bar chart */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        <p className="text-sm font-semibold text-gray-900 mb-4">Top Content Categories</p>
        {categories.map(t => (
          <div key={t.tag} className="flex items-center gap-3 mb-2">
            <span className="text-xs text-gray-600 w-16">{t.tag}</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full" style={{ width: `${t.pct}%` }} />
            </div>
            <span className="text-xs text-gray-400 w-8 text-right">{t.pct}%</span>
          </div>
        ))}
      </div>
    </>
  );
}
