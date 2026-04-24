import { useApp } from '../context/AppContext';

/**
 * Linearly interpolates between two integer values.
 * Used to smoothly transition the button colour from blue (calm) to red (over goal).
 *
 * @param {number} a - Start value.
 * @param {number} b - End value.
 * @param {number} t - Progress fraction in [0, 1].
 * @returns {number} Rounded interpolated integer.
 */
function linearInterpolation(a, b, t) {
  return Math.round(a + (b - a) * t);
}

/**
 * Converts a session progress fraction to an RGB colour string.
 * Interpolates from blue (#3B82F6) at 0% usage to red (#EF4444) at 100%.
 * Using lerp instead of CSS transitions avoids jarring colour jumps on re-renders.
 *
 * @param {number} pct - Progress fraction in [0, 1].
 * @returns {string} CSS rgb() colour string.
 */
function getColor(pct) {
  const r = linearInterpolation(0x3B, 0xEF, pct);
  const g = linearInterpolation(0x82, 0x44, pct);
  const b = linearInterpolation(0xF6, 0x44, pct);
  return `rgb(${r},${g},${b})`;
}

/**
 * Floating circular button that opens the session panel and serves as a health indicator.
 * Colour transitions from blue (calm) to red (over goal) as session time increases.
 * Pulses when the time goal has been exceeded (pulse-ring CSS animation).
 *
 * @param {object} props
 * @param {function} props.onOpen - Called when the button is tapped to open the session panel.
 */
export default function HealthIcon({ onOpen }) {
  const { state } = useApp();
  const { session } = state;
  const goalSec = (session.timeGoal || 12) * 60;
  const pct = Math.min(session.elapsedSec / goalSec, 1);
  const isAlert = pct >= 1;
  const color = getColor(pct);

  return (
    <button
      onClick={onOpen}
      className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-colors duration-1000 ${isAlert ? 'pulse-ring' : ''}`}
      style={{ backgroundColor: color }}
      aria-label="Session status"
    >
      {/* Person silhouette with heart inside — icon colour matches button bg for contrast */}
      <svg viewBox="0 0 32 32" className="w-11 h-11" fill="white">
        {/* Head */}
        <circle cx="16" cy="12" r="7" />
        {/* Body */}
        <path d="M4 30c0-7 5.4-11.5 12-11.5S28 23 28 30" />
        {/* Heart inside the head — rendered in button bg colour so it "cuts out" from the white fill */}
        <path
          d="M16 16.5C16 16.5 12 14 12 11.5C12 10 13.2 9 14.5 9C15.3 9 15.9 9.5 16 10.3C16.1 9.5 16.7 9 17.5 9C18.8 9 20 10 20 11.5C20 14 16 16.5 16 16.5Z"
          fill={color}
        />
      </svg>
    </button>
  );
}
