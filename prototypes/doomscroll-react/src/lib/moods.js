/**
 * Canonical mood definitions shared between MoodPicker and MoodHistory.
 * Score 1 = worst, 5 = best. Index 0 is null (scores are 1-based).
 */
export const MOOD_DEFS = [
  null,
  { score: 1, emoji: '😞', label: 'Not great', bg: '#fde8ea' },
  { score: 2, emoji: '😕', label: 'Meh',       bg: '#fff0e0' },
  { score: 3, emoji: '😐', label: 'Okay',       bg: '#fffbea' },
  { score: 4, emoji: '🙂', label: 'Good',       bg: '#e0f7ff' },
  { score: 5, emoji: '😄', label: 'Great',      bg: '#e0faf3' },
];

/** MOOD_EMOJI[score] → emoji string. Index 0 is empty string. */
export const MOOD_EMOJI = MOOD_DEFS.map(d => d?.emoji ?? '');
