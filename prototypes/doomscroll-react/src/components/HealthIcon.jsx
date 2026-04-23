import { useApp } from '../context/AppContext';

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function getColor(pct) {
  // Blue #3B82F6 → Red #EF4444
  const r = lerp(0x3B, 0xEF, pct);
  const g = lerp(0x82, 0x44, pct);
  const b = lerp(0xF6, 0x44, pct);
  return `rgb(${r},${g},${b})`;
}

export default function HealthIcon({ onOpen }) {
  const { state } = useApp();
  const { session } = state;
  const goalSec = (session.timeGoal || 12) * 60;
  const pct = Math.min(session.elapsedSec / goalSec, 1);
  const isAlert = pct >= 1;
  const color = getColor(pct);

  const mins = Math.floor(session.elapsedSec / 60);
  const secs = session.elapsedSec % 60;
  const goalMins = session.timeGoal || 12;
  const remaining = Math.max(0, goalMins * 60 - session.elapsedSec);
  const remMins = Math.floor(remaining / 60);
  const remSecs = remaining % 60;

  return (
    <button
      onClick={onOpen}
      className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-colors duration-1000 ${isAlert ? 'pulse-ring' : ''}`}
      style={{ backgroundColor: color }}
      aria-label="Session status"
    >
      {/* Person silhouette (white) with heart inside the head in button bg color */}
      <svg viewBox="0 0 32 32" className="w-11 h-11" fill="white">
        {/* Head — lowered so it touches the torso */}
        <circle cx="16" cy="12" r="7" />
        {/* Body */}
        <path d="M4 30c0-7 5.4-11.5 12-11.5S28 23 28 30" />
        {/* Heart inside head — shifted down with the head */}
        <path
          d="M16 16.5C16 16.5 12 14 12 11.5C12 10 13.2 9 14.5 9C15.3 9 15.9 9.5 16 10.3C16.1 9.5 16.7 9 17.5 9C18.8 9 20 10 20 11.5C20 14 16 16.5 16 16.5Z"
          fill={color}
        />
      </svg>
    </button>
  );
}

export function TimerBar() {
  const { state } = useApp();
  const { session } = state;
  const goalSec = (session.timeGoal || 12) * 60;
  const pct = Math.min(session.elapsedSec / goalSec, 1);
  const isOver = pct >= 1;

  const remaining = Math.max(0, goalSec - session.elapsedSec);
  const remMins = Math.floor(remaining / 60);
  const remSecs = remaining % 60;

  return (
    <div className="relative h-7 bg-white border-b border-gray-200 overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 transition-all duration-1000"
        style={{
          width: `${pct * 100}%`,
          backgroundColor: isOver ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.1)',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-[12px] font-medium ${isOver ? 'text-red-500' : 'text-gray-500'}`}>
          {isOver ? 'Time exceeded' : `${remMins}:${String(remSecs).padStart(2,'0')} remaining`}
        </span>
      </div>
    </div>
  );
}
