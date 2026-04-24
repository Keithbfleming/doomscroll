import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WELLNESS_FACTS } from '../lib/mockData';
import ConfirmationModal from '../components/ConfirmationModal';

/**
 * Full-screen mental wellness break shown during a session.
 * Displays a countdown timer, wellness fact, and calm visuals.
 * Auto-returns to feed when the timer reaches zero.
 *
 * @param {object} props
 * @param {function} props.onReturn - Called when the break ends (auto or manual "Return to feed").
 * @param {number} [props.breakMins=5] - Duration of the break in minutes.
 *   Defaults to 5 if not passed; the parent (Feed.jsx) should pass persisted.mentalBreakMins.
 */
export default function MentalBreak({ onReturn, breakMins = 5 }) {
  const { dispatch } = useApp();

  // Total duration in seconds — recalculated if breakMins prop changes
  const BREAK_DURATION = breakMins * 60;

  const [remaining, setRemaining] = useState(breakMins * 60);
  // Pick a random wellness fact once on mount so it doesn't change each tick
  const [factIndex] = useState(() => Math.floor(Math.random() * WELLNESS_FACTS.length));
  const [showEarlyConfirm, setShowEarlyConfirm] = useState(false);
  const [extraMins, setExtraMins] = useState(15);

  // Countdown: decrement every second, auto-return at zero
  useEffect(() => {
    if (remaining <= 0) {
      onReturn();
      return;
    }
    const t = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, onReturn]);

  /**
   * Resets the countdown to the user-entered extra minutes instead of ending the break.
   * Called from the "Extend break" button inside the early-return modal.
   */
  function handleExtend() {
    setRemaining((extraMins || 15) * 60);
    setShowEarlyConfirm(false);
  }

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  // Progress fraction — drives the SVG ring; goes from 0 (fresh) to 1 (complete)
  const pct = (BREAK_DURATION - remaining) / BREAK_DURATION;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#1a1a1a] px-8 fade-in relative">
      {/* Calm face icon */}
      <div className="w-24 h-24 rounded-full bg-[#2a2a2a] flex items-center justify-center mb-8">
        <svg viewBox="0 0 64 64" className="w-16 h-16">
          <circle cx="32" cy="32" r="28" fill="#3a3a3a" />
          {/* Eyes */}
          <circle cx="22" cy="26" r="3" fill="#9ca3af" />
          <circle cx="42" cy="26" r="3" fill="#9ca3af" />
          {/* Calm smile */}
          <path d="M22 40 Q32 48 42 40" stroke="#9ca3af" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Decorative sparkle dots */}
          <circle cx="48" cy="14" r="2" fill="#60a5fa" opacity="0.6" />
          <circle cx="16" cy="50" r="1.5" fill="#60a5fa" opacity="0.4" />
        </svg>
      </div>

      <h2 className="text-2xl font-semibold text-gray-200 mb-2 text-center">Take a breath</h2>
      <p className="text-gray-400 text-sm text-center mb-10 leading-relaxed max-w-xs">
        You've earned a moment of rest. Step away and come back feeling refreshed.
      </p>

      {/* Wellness fact card */}
      <div className="bg-[#2a2a2a] rounded-2xl p-5 mb-10 w-full max-w-xs">
        <p className="text-xs text-blue-400 font-medium uppercase tracking-wide mb-2">Did you know?</p>
        <p className="text-gray-300 text-sm leading-relaxed">{WELLNESS_FACTS[factIndex]}</p>
      </div>

      {/* SVG countdown ring — rotated -90° so progress starts from the top */}
      <div className="relative w-32 h-32 mb-4">
        <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
          <circle cx="64" cy="64" r="56" fill="none" stroke="#2a2a2a" strokeWidth="8" />
          <circle
            cx="64" cy="64" r="56"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * pct}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-200">
            {mins}:{String(secs).padStart(2, '0')}
          </span>
          <span className="text-xs text-gray-500 mt-1">remaining</span>
        </div>
      </div>

      <p className="text-gray-500 text-sm mb-8">Returning to feed automatically</p>

      {/* Return early — opens confirmation modal rather than immediately returning */}
      <button
        onClick={() => setShowEarlyConfirm(true)}
        className="text-gray-600 text-sm underline underline-offset-2 mb-3"
      >
        Return early
      </button>

      {/* Close app — navigates to the fake homescreen */}
      <button
        onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'homescreen' })}
        className="text-gray-700 text-sm"
      >
        Close app
      </button>

      {/* Early-return confirmation modal */}
      {showEarlyConfirm && (
        <ConfirmationModal
          title="Need more time?"
          continueLabel="Extend break"
          cancelLabel="Return to feed"
          showTimeInput={false}
          onCancel={onReturn}
          onContinue={handleExtend}
        >
          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
            Your break isn't over yet. How many more minutes would you like?
          </p>
          <div className="flex items-center gap-3 mb-5">
            <input
              type="number"
              value={extraMins}
              onChange={e => setExtraMins(parseInt(e.target.value) || 15)}
              min="1"
              max="60"
              className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm text-center"
            />
            <span className="text-sm text-gray-500">minutes</span>
          </div>
        </ConfirmationModal>
      )}
    </div>
  );
}
