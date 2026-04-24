import { DAY_NAMES } from '../../lib/constants';

/**
 * Bar chart showing daily usage in minutes for the current week.
 * Only renders days up to and including today (future days are hidden).
 * Bars are colour-coded: blue = today, red = over the daily average goal, gray = normal.
 * Legend lives inside this component.
 *
 * @param {object} props
 * @param {Array<number>} props.weeklyData - 7 values (Mon–Sun) of minutes used per day.
 * @param {number} props.weeklyGoal - Total weekly goal in minutes; used to derive the daily avg.
 * @param {number} props.todayIndex - Index of today in the week (0 = Monday).
 */
export default function WeeklyChart({ weeklyData, weeklyGoal, todayIndex }) {
  // Only show days up to and including today
  const visibleData = weeklyData.slice(0, todayIndex + 1);
  const maxVal = Math.max(...visibleData, 1);
  const dailyAvg = weeklyGoal / 7;
  const allZero = visibleData.every(v => v === 0);

  if (allZero) {
    return (
      <div className="flex flex-col items-center justify-center h-20 text-gray-300 text-sm">
        No usage data yet this week
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-1.5 h-20">
        {visibleData.map((val, i) => {
          const isToday = i === todayIndex;
          const overGoal = val > dailyAvg;
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

      {/* Legend — lives inside the chart component */}
      <div className="flex items-center gap-4 mt-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
          <span className="text-[11px] text-gray-400">Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-gray-300" />
          <span className="text-[11px] text-gray-400">Under avg</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-red-400" />
          <span className="text-[11px] text-gray-400">Over avg</span>
        </div>
      </div>
    </div>
  );
}
