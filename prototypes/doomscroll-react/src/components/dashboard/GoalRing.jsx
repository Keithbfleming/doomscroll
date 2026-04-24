import { useState } from 'react';

/**
 * Circular SVG progress ring showing weekly usage vs the weekly goal.
 * Rendered as a standalone card with an inline goal editor that expands on demand.
 *
 * @param {object} props
 * @param {number} props.used - Total minutes used this week.
 * @param {number} props.goal - Weekly goal in minutes.
 * @param {function} props.onGoalChange - Called with the new goal number when the stepper changes.
 */
export default function GoalRing({ used, goal, onGoalChange }) {
  const [editingGoal, setEditingGoal] = useState(false);

  const r = 40;
  const circ = 2 * Math.PI * r;
  // Cap the fill at 100% so the ring doesn't wrap around when over goal
  const pct = Math.min(used / goal, 1);
  const color = pct >= 1 ? '#ef4444' : '#3B82F6';

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100">
      <div className="flex items-center gap-5">
        {/* SVG ring */}
        <svg viewBox="0 0 96 96" className="w-24 h-24 flex-shrink-0">
          {/* Background track */}
          <circle cx="48" cy="48" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
          {/* Progress arc — rotated so it starts from the top */}
          <circle
            cx="48" cy="48" r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct)}
            strokeLinecap="round"
            transform="rotate(-90 48 48)"
          />
          <text x="48" y="44" textAnchor="middle" fontSize="13" fontWeight="700" fill="#111827">
            {Math.round(pct * 100)}%
          </text>
          <text x="48" y="57" textAnchor="middle" fontSize="9" fill="#9ca3af">of goal</text>
        </svg>

        {/* Usage summary */}
        <div className="flex-1">
          <p className="text-2xl font-bold text-gray-900">{used} <span className="text-sm font-normal text-gray-500">min used</span></p>
          <p className="text-xs text-gray-400 mt-0.5">of {goal} min/week</p>

          {/* Inline goal editor toggle */}
          {!editingGoal ? (
            <button
              onClick={() => setEditingGoal(true)}
              className="mt-2 text-xs text-blue-500 underline underline-offset-2"
            >
              Edit goal
            </button>
          ) : (
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => onGoalChange(Math.max(15, goal - 15))}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-sm"
              >
                −
              </button>
              <span className="text-sm font-semibold w-10 text-center">{goal}</span>
              <button
                onClick={() => onGoalChange(Math.min(600, goal + 15))}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-sm"
              >
                +
              </button>
              <button
                onClick={() => setEditingGoal(false)}
                className="text-xs text-gray-400 ml-1"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
