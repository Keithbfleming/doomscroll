import { useApp, SPEED } from '../context/AppContext';

/**
 * Thin progress bar shown below the feed header during an active session.
 * Fills left-to-right as time elapses, turning red with an "exceeded" message
 * once the user's time goal is reached.
 *
 * Visibility is controlled by Feed.jsx via the persisted.enableTimerBar setting.
 * This component does not conditionally render itself — the parent handles that.
 */
export default function TimerBar() {
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
      {/* Background fill — blue tint while under goal, red tint when over */}
      <div
        className="absolute inset-y-0 left-0 transition-all duration-1000"
        style={{
          width: `${pct * 100}%`,
          backgroundColor: isOver ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.1)',
        }}
      />
      {/* Centered countdown text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-[12px] font-medium ${isOver ? 'text-red-500' : 'text-gray-500'}`}>
          {isOver
            ? 'Time exceeded'
            : `${remMins}:${String(remSecs).padStart(2, '0')} remaining${SPEED > 1 ? ` · ${SPEED}x` : ''}`
          }
        </span>
      </div>
    </div>
  );
}
