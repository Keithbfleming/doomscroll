import { MOOD_EMOJI } from '../../lib/moods';

function ringColor(mins) {
  if (mins > 60) return '#ef4444';
  if (mins > 30) return '#f59e0b';
  return '#3B82F6';
}

function getMoodInsight(moodHistory, weeklyData, todayIndex) {
  const pastMoods = moodHistory.slice(0, todayIndex + 1);
  const pastUsage = weeklyData.slice(0, todayIndex + 1);
  const filled = pastMoods.filter(m => m !== null);
  if (filled.length < 2) return null;

  const recent = filled.slice(-3);
  const avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length;
  const highUsageLowMood = pastUsage.some((mins, i) =>
    mins > 60 && pastMoods[i] !== null && pastMoods[i] <= 2
  );

  if (avgRecent <= 2.5) return "Your mood after sessions has been dipping — shorter sessions might help.";
  if (highUsageLowMood) return "Your mood dips on heavier-use days — try setting a lower daily limit.";
  if (avgRecent >= 4) return "You seem to be managing your screen time well this week. Keep it up!";
  return null;
}

/**
 * @param {object} props
 * @param {Array<number|null>} props.moodHistory
 * @param {Array<number>} props.weeklyData
 * @param {Array<string>} props.dayNames
 * @param {number} props.todayIndex - 0=Mon … 6=Sun. Only days up to this index are shown.
 */
export default function MoodHistory({ moodHistory, weeklyData, dayNames, todayIndex }) {
  // Only render days that have passed (including today)
  const visibleMoods = moodHistory.slice(0, todayIndex + 1);
  const visibleUsage = weeklyData.slice(0, todayIndex + 1);
  const visibleDays = dayNames.slice(0, todayIndex + 1);

  const insight = getMoodInsight(moodHistory, weeklyData, todayIndex);

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100">
      <p className="text-sm font-semibold text-gray-900 mb-4">Mood After Sessions</p>
      <div className="flex gap-1.5 mb-4">
        {visibleDays.map((day, i) => {
          const mood = visibleMoods[i];
          const mins = visibleUsage[i] || 0;
          const isToday = i === todayIndex;
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-base border-2"
                style={{
                  borderColor: isToday ? '#3B82F6' : mins > 0 ? ringColor(mins) : '#e5e7eb',
                  backgroundColor: mood ? '#f9fafb' : '#f3f4f6',
                }}
              >
                {mood
                  ? <span>{MOOD_EMOJI[mood]}</span>
                  : <span className="text-[10px] text-gray-300">?</span>
                }
              </div>
              <span className={`text-[9px] font-medium ${isToday ? 'text-blue-500' : 'text-gray-400'}`}>{day}</span>
              {mins > 0 && <span className="text-[9px] text-gray-300">{mins}m</span>}
            </div>
          );
        })}
      </div>
      {insight && (
        <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-2">
          <span className="text-base mt-0.5">📉</span>
          <p className="text-xs text-gray-600 leading-relaxed">{insight}</p>
        </div>
      )}
    </div>
  );
}
