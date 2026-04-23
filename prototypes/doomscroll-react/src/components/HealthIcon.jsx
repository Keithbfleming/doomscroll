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
      className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${isAlert ? 'pulse-ring' : ''}`}
      style={{ backgroundColor: color }}
      aria-label="Session status"
    >
      {/* Head + Heart icon */}
      <svg viewBox="0 0 32 32" className="w-8 h-8 text-white" fill="white">
        {/* Head */}
        <circle cx="16" cy="11" r="5.5" />
        {/* Body arc */}
        <path d="M6 26c0-5.523 4.477-9 10-9s10 3.477 10 9" strokeWidth={0} />
        {/* Small heart */}
        <path
          d="M16 22.5c-.5-.4-2-1.6-2-2.8a1.5 1.5 0 013 0 1.5 1.5 0 013 0c0 1.2-1.5 2.4-2 2.8l-1 .7-1-.7z"
          fill="rgba(255,255,255,0.9)"
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
