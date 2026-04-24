import { DashboardShortcut } from '../';

/**
 * Instagram-style top navigation bar for the feed screen.
 * Purely decorative in this prototype — buttons have no action handlers.
 * Renders the logo wordmark, a compose (new post) button, and a messages button
 * with a fake unread badge.
 */
export default function FeedHeader() {
  return (
    <div className="flex items-center justify-between px-4 pt-10 pb-2 bg-white border-b border-gray-200">
      {/* Instagram wordmark — uses Grand Hotel for the cursive style */}
      <span
        className="text-2xl font-bold text-gray-900"
        style={{ fontFamily: "'Grand Hotel', cursive, sans-serif" }}
      >
        Instagram
      </span>

      <div className="flex items-center gap-4">
        <DashboardShortcut />
        {/* New post button */}
        <button className="text-gray-900" aria-label="New post">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {/* Messages button with unread badge */}
        <button className="text-gray-900 relative" aria-label="Messages">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          {/* Fake unread count */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
            3
          </span>
        </button>
      </div>
    </div>
  );
}
