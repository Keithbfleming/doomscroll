/**
 * Instagram-style bottom tab bar for the feed screen.
 * All tabs are purely decorative in this prototype — no navigation is wired.
 * The profile avatar uses a seeded picsum image to feel authentic.
 */
export default function BottomNav() {
  const tabs = [
    {
      key: 'home',
      label: 'Home',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ),
    },
    {
      key: 'search',
      label: 'Search',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
        </svg>
      ),
    },
    {
      key: 'add',
      label: 'New post',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path strokeLinecap="round" d="M12 8v8M8 12h8" />
        </svg>
      ),
    },
    {
      key: 'reel',
      label: 'Reels',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <polygon fill="currentColor" points="10,8 16,12 10,16" />
        </svg>
      ),
    },
    {
      key: 'profile',
      label: 'Profile',
      icon: (
        <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
          <img
            src="https://picsum.photos/seed/me/48/48"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex items-center justify-around px-4 py-3 bg-white border-t border-gray-200">
      {tabs.map(tab => (
        <button key={tab.key} className="text-gray-900 p-1" aria-label={tab.label}>
          {tab.icon}
        </button>
      ))}
    </div>
  );
}
