/** All available mood options, ordered from worst to best. */
const MOODS = [
  { score: 1, emoji: '😞', label: 'Not great', bg: '#fde8ea' },
  { score: 2, emoji: '😕', label: 'Meh',       bg: '#fff0e0' },
  { score: 3, emoji: '😐', label: 'Okay',       bg: '#fffbea' },
  { score: 4, emoji: '🙂', label: 'Good',       bg: '#e0f7ff' },
  { score: 5, emoji: '😄', label: 'Great',      bg: '#e0faf3' },
];

/**
 * Row of 5 emoji buttons for recording the user's post-session mood.
 * The selected mood is visually highlighted with a coloured background and a blue border.
 *
 * @param {object} props
 * @param {number|null} props.currentMood - The currently selected mood score (1–5), or null if unset.
 * @param {function} props.onSelect - Called with the mood score number when the user picks one.
 */
export default function MoodPicker({ currentMood, onSelect }) {
  return (
    <div className="mb-5">
      <p className="text-sm font-semibold text-gray-700 mb-3">How are you feeling?</p>
      <div className="flex justify-between gap-1">
        {MOODS.map(m => (
          <button
            key={m.score}
            onClick={() => onSelect(m.score)}
            className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all"
            style={{
              backgroundColor: currentMood === m.score ? m.bg : '#f9fafb',
              border: `2px solid ${currentMood === m.score ? '#3B82F6' : 'transparent'}`,
              // Slight scale-up gives tactile feedback without layout shift
              transform: currentMood === m.score ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <span className="text-2xl">{m.emoji}</span>
            <span className="text-[10px] text-gray-500 leading-tight text-center">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
