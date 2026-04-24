import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

/**
 * Fake iPhone homescreen shown when the user "closes" the app from MentalBreak.
 * Renders a dark wallpaper, a live clock, and a 4-column grid of app icons.
 * The Instagram icon is the only tappable icon — it re-launches the app.
 * No back button; the only re-entry point is tapping Instagram.
 */
export default function HomeScreen() {
  const { dispatch } = useApp();
  const [time, setTime] = useState(formatTime(new Date()));

  // Update clock every second
  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  /**
   * Formats a Date object into an "HH:MM" string in 12-hour format.
   * @param {Date} d
   * @returns {string}
   */
  function formatTime(d) {
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  }

  /**
   * Tapping the Instagram icon dispatches a screen change to 'preSession'.
   * AppContext/PreSession will skip to 'feed' automatically if enablePreSession is false.
   */
  function handleInstagramTap() {
    dispatch({ type: 'SET_SCREEN', screen: 'preSession' });
  }

  // Fake app icons — only Instagram is functional
  const apps = [
    { label: 'Camera',    emoji: '📷', bg: '#1c1c1e' },
    { label: 'Maps',      emoji: '🗺',  bg: '#1c1c1e' },
    { label: 'Music',     emoji: '🎵', bg: '#1c1c1e' },
    { label: 'Phone',     emoji: '📞', bg: '#34c759' },
    { label: 'Messages',  emoji: '💬', bg: '#34c759' },
    { label: 'Safari',    emoji: '🌐', bg: '#0a84ff' },
    { label: 'Settings',  emoji: '⚙️', bg: '#636366' },
    { label: 'Instagram', emoji: null, bg: null, isInstagram: true },
    { label: 'Calendar',  emoji: '📅', bg: '#ff3b30' },
    { label: 'Torch',     emoji: '🔦', bg: '#1c1c1e' },
    { label: 'Games',     emoji: '🎮', bg: '#5e5ce6' },
    { label: 'Wallet',    emoji: '💳', bg: '#1c1c1e' },
    { label: 'Clock',     emoji: '🕐', bg: '#1c1c1e' },
    { label: 'Health',    emoji: '❤️', bg: '#ff2d55' },
    { label: 'News',      emoji: '📰', bg: '#ff3b30' },
    { label: 'Podcasts',  emoji: '🎧', bg: '#b160ed' },
  ];

  return (
    <div
      className="flex flex-col h-full relative"
      style={{
        background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #1a1a2e 100%)',
      }}
    >
      {/* Status bar clock */}
      <div className="flex flex-col items-center pt-14 pb-8 select-none">
        <span className="text-white/60 text-sm font-medium tracking-wide uppercase mb-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
        <span className="text-white text-6xl font-thin tracking-tight">{time}</span>
      </div>

      {/* App grid — 4 columns */}
      <div className="flex-1 px-6 overflow-y-auto scrollbar-hide">
        <div className="grid grid-cols-4 gap-x-4 gap-y-6">
          {apps.map((app, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              {app.isInstagram ? (
                /* Instagram icon — functional, real gradient */
                <button
                  onClick={handleInstagramTap}
                  className="w-14 h-14 rounded-[14px] flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                  style={{
                    background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                  }}
                  aria-label="Open Instagram"
                >
                  {/* Instagram camera glyph */}
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="white">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2" />
                    <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="2" />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
                  </svg>
                </button>
              ) : (
                /* Decorative icon — no onClick */
                <div
                  className="w-14 h-14 rounded-[14px] flex items-center justify-center shadow-md"
                  style={{ backgroundColor: app.bg }}
                >
                  <span className="text-2xl">{app.emoji}</span>
                </div>
              )}
              <span className="text-white/80 text-[10px] font-medium text-center leading-tight w-14 truncate">
                {app.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Dock hint */}
      <div className="flex items-center justify-center pb-8 pt-4">
        <span className="text-white/30 text-xs">Tap Instagram to reopen</span>
      </div>
    </div>
  );
}
