import { FEET_PER_POST } from '../../lib/constants';

/**
 * Dashboard card showing cumulative scroll distance today and this week.
 * Uses the same feet-per-post constant as the session panel's OpportunityCosts.
 *
 * @param {object} props
 * @param {Array<{posts: number}>} props.sessionHistory - Past session records.
 * @param {number} [props.todayPostCount=0] - Posts from the active/most-recent session today.
 */
export default function DistanceScrolled({ sessionHistory, todayPostCount = 0 }) {
  const MILE_IN_FEET = 5280;

  const todayFeet = todayPostCount * FEET_PER_POST;
  const weeklyFeet = sessionHistory.reduce((sum, s) => sum + (s.posts || 0) * FEET_PER_POST, 0) + todayFeet;
  const weeklyPct = Math.min(weeklyFeet / MILE_IN_FEET, 1);

  function distanceLabel(feet) {
    if (feet < 528) return `${Math.round(feet / 3)} yards`;
    return `${(feet / 5280).toFixed(2)} miles`;
  }

  function metaphor(feet) {
    if (feet < 264) return 'length of a basketball court';
    if (feet < 528) return 'nearly a city block';
    if (feet < 1320) return 'a few city blocks';
    if (feet < 5280) return 'nearly a quarter mile';
    return 'over a mile';
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100">
      <p className="text-sm font-semibold text-gray-900 mb-4">Distance Scrolled</p>
      <div className="flex items-center mb-3">
        <div className="flex-1 text-center border-r border-gray-100 pr-4">
          <p className="text-2xl font-bold text-gray-900">
            {todayFeet} <span className="text-sm font-normal text-gray-400">ft</span>
          </p>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">Today</p>
        </div>
        <div className="flex-1 text-center pl-4">
          <p className="text-2xl font-bold text-gray-900">
            {weeklyFeet} <span className="text-sm font-normal text-gray-400">ft</span>
          </p>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">This week</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 italic mb-3">
        {distanceLabel(weeklyFeet)} — {metaphor(weeklyFeet)} this week.
      </p>
      <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-blue-500 rounded-full transition-all"
          style={{ width: `${weeklyPct * 100}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-300">0</span>
        <span className="text-[10px] text-gray-300">1 mile</span>
      </div>
    </div>
  );
}
