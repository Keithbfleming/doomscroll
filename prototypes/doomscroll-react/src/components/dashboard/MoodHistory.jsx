/**
 * Derives a recommendation string from the user's recent mood and usage data.
 * Returns null if there's not enough data to draw a meaningful conclusion.
 *
 * @param {Array<number|null>} moodHistory - 7-element array, 1=worst, 5=best, null=no entry.
 * @param {Array<number>} weeklyData - Minutes per day, parallel to moodHistory.
 * @returns {string|null}
 */
function getMoodInsight(moodHistory, weeklyData) {
  const filled = moodHistory.filter(m => m !== null);
  // Need at least 3 data points for the insight to be meaningful
  if (filled.length < 3) return null;

  const recent = moodHistory.slice(-3).filter(m => m !== null);
  const avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length;

  // Check if any day with heavy usage correlates with a low mood score
  const highUsageLowMood = weeklyData.some((mins, i) =>
    mins > 60 && moodHistory[i] !== null && moodHistory[i] <= 2
  );

  if (avgRecent <= 2) {
    return "Your mood after sessions has been dipping — shorter sessions might help.";
  }
  if (highUsageLowMood) {
    return "Your mood dips on heavier-use days — try setting a lower daily limit.";
  }
  if (avgRecent >= 4) {
    return "You seem to be managing your screen time well this week. Keep it up!";
  }
  return null;
}

// Mood emoji indexed by score 1–5 (index 0 is unused)
const MOOD_EMOJI_MAP = ['', '😟', '😑', '😐', '😊', '😊'];

// Ring border colours that communicate usage level for each day
function ringColor(mins) {
  if (mins > 60) return '#ef4444'; // red — high usage
  if (mins > 30) return '#f59e0b'; // orange — medium
  return '#3B82F6';                // blue — low usage
}

/**
 * Card showing per-day mood emoji with usage minutes below, plus an insight callout
 * when mood data is sufficient to derive a recommendation.
 *
 * @param {object} props
 * @param {Array<number|null>} props.moodHistory - 7 mood scores (1–5 | null).
 * @param {Array<number>} props.weeklyData - Minutes used per day (parallel to moodHistory).
 * @param {Array<string>} props.dayNames - 7 day abbreviations, e.g. ['Mon','Tue',...].
 */
export default function MoodHistory({ moodHistory, weeklyData, dayNames }) {
  const insight = getMoodInsight(moodHistory, weeklyData);

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100">
      <p className="text-sm font-semibold text-gray-900 mb-4">Mood After Sessions</p>

      {/* Day-by-day emoji row */}
      <div className="flex gap-1.5 mb-4">
        {dayNames.map((day, i) => {
          const mood = moodHistory[i];
          const mins = weeklyData[i] || 0;
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              {/* Emoji circle with ring border indicating usage level */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-base border-2"
                style={{
                  borderColor: mins > 0 ? ringColor(mins) : '#e5e7eb',
                  backgroundColor: mood ? '#f9fafb' : '#f3f4f6',
                }}
              >
                {mood
                  ? <span>{MOOD_EMOJI_MAP[mood]}</span>
                  : <span className="text-[10px] text-gray-300">?</span>
                }
              </div>
              <span className="text-[9px] text-gray-400 font-medium">{day}</span>
              {mins > 0 && (
                <span className="text-[9px] text-gray-300">{mins}m</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Insight callout — hidden when there's not enough data */}
      {insight && (
        <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-2">
          <span className="text-base mt-0.5">📉</span>
          <p className="text-xs text-gray-600 leading-relaxed">{insight}</p>
        </div>
      )}
    </div>
  );
}
