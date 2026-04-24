import { DAY_NAMES } from '../../lib/mockData';

/**
 * Bar chart showing daily usage in minutes for the current week.
 * Bars are colour-coded: blue = today, red = over the daily average goal, gray = normal.
 *
 * @param {object} props
 * @param {Array<number>} props.weeklyData - 7 values (Mon–Sun) of minutes used per day.
 * @param {number} props.weeklyGoal - Total weekly goal in minutes; used to derive the daily avg.
 * @param {number} props.todayIndex - Index of today in the week (0 = Monday).
 */
export default function WeeklyChart({ weeklyData, weeklyGoal, todayIndex }) {
  // Find the tallest bar so all bars are relative to it (prevents 0-height bars)
  const maxVal = Math.max(...weeklyData, 1);

  return (
    <div className="flex items-end justify-between gap-1.5 h-20">
      {weeklyData.map((val, i) => {
        const isToday = i === todayIndex;
        // Over-goal when usage exceeds the equally-divided daily share
        const overGoal = val > weeklyGoal / 7;
        // Minimum 4% height so zero-usage days still show a sliver
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
