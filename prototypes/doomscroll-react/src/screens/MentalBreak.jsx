import { useState, useEffect } from 'react';
import { WELLNESS_FACTS } from '../lib/mockData';

const BREAK_DURATION = 5 * 60; // 5 minutes in seconds

export default function MentalBreak({ onReturn }) {
  const [remaining, setRemaining] = useState(BREAK_DURATION);
  const [factIndex] = useState(() => Math.floor(Math.random() * WELLNESS_FACTS.length));

  useEffect(() => {
    if (remaining <= 0) {
      onReturn();
      return;
    }
    const t = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, onReturn]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const pct = (BREAK_DURATION - remaining) / BREAK_DURATION;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#1a1a1a] px-8 fade-in">
      {/* Calm face icon */}
      <div className="w-24 h-24 rounded-full bg-[#2a2a2a] flex items-center justify-center mb-8">
        <svg viewBox="0 0 64 64" className="w-16 h-16">
          <circle cx="32" cy="32" r="28" fill="#3a3a3a" />
          {/* Eyes */}
          <circle cx="22" cy="26" r="3" fill="#9ca3af" />
          <circle cx="42" cy="26" r="3" fill="#9ca3af" />
          {/* Calm smile */}
          <path d="M22 40 Q32 48 42 40" stroke="#9ca3af" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Sparkle */}
          <circle cx="48" cy="14" r="2" fill="#60a5fa" opacity="0.6" />
          <circle cx="16" cy="50" r="1.5" fill="#60a5fa" opacity="0.4" />
        </svg>
      </div>

      <h2 className="text-2xl font-semibold text-gray-200 mb-2 text-center">Take a breath</h2>
      <p className="text-gray-400 text-sm text-center mb-10 leading-relaxed max-w-xs">
        You've earned a moment of rest. Step away and come back feeling refreshed.
      </p>

      {/* Wellness fact */}
      <div className="bg-[#2a2a2a] rounded-2xl p-5 mb-10 w-full max-w-xs">
        <p className="text-xs text-blue-400 font-medium uppercase tracking-wide mb-2">Did you know?</p>
        <p className="text-gray-300 text-sm leading-relaxed">{WELLNESS_FACTS[factIndex]}</p>
      </div>

      {/* Countdown ring */}
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
          <span className="text-3xl font-bold text-gray-200">{mins}:{String(secs).padStart(2, '0')}</span>
          <span className="text-xs text-gray-500 mt-1">remaining</span>
        </div>
      </div>

      <p className="text-gray-500 text-sm mb-8">Returning to feed automatically</p>

      {/* Skip button */}
      <button
        onClick={onReturn}
        className="text-gray-600 text-sm underline underline-offset-2"
      >
        Return early
      </button>
    </div>
  );
}
