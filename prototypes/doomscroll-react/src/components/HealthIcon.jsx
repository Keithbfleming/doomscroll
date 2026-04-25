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
 * Converts a session progress fraction to RGB channels.
 * Interpolates from blue (#3B82F6) at 0% usage to red (#EF4444) at 100%.
 *
 * @param {number} pct - Progress fraction in [0, 1].
 * @returns {{r:number,g:number,b:number}} RGB channel values.
 */
function getColorChannels(pct) {
  return {
    r: linearInterpolation(0x3B, 0xEF, pct),
    g: linearInterpolation(0x82, 0x44, pct),
    b: linearInterpolation(0xF6, 0x44, pct),
  };
}

/**
 * Floating circular button that opens the session panel and serves as a health indicator.
 * Colour transitions from blue (calm) to red (over goal) as session time increases.
 * A pulse ring runs continuously; its spread, opacity, color, and speed all scale
 * with progress so the cue ramps from faint+slow at 0% to prominent+fast at 100%+.
 * Provides a non-color signal for colorblind viewers throughout the session and
 * reinforces the color gradient for everyone else.
 *
 * @param {object} props
 * @param {function} props.onOpen - Called when the button is tapped to open the session panel.
 */
export default function HealthIcon({ onOpen }) {
  const { state } = useApp();
  const { session } = state;
  const goalSec = (session.timeGoal || 12) * 60;
  const pct = Math.min(session.elapsedSec / goalSec, 1);
  const { r, g, b } = getColorChannels(pct);
  const color = `rgb(${r},${g},${b})`;

  // Pulse parameters all scale linearly with pct so the cue ramps with progress.
  const pulseSpread = `${2 + pct * 14}px`;          // 2px → 16px
  const pulseOpacity = 0.05 + pct * 0.6;            // 0.05 → 0.65
  const pulseDuration = `${(2.5 - pct * 1.9).toFixed(2)}s`; // 2.5s → 0.6s
  const pulseColor = `rgba(${r},${g},${b},${pulseOpacity})`;

  return (
    <button
      onClick={onOpen}
      className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-colors duration-1000 pulse-ring"
      style={{
        backgroundColor: color,
        '--pulse-spread': pulseSpread,
        '--pulse-color': pulseColor,
        '--pulse-duration': pulseDuration,
      }}
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
