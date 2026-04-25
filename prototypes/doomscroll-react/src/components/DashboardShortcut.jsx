import { useApp } from '../context/AppContext';

/**
 * Circular icon button in the PreSession header that navigates directly to the Dashboard.
 * Gives users quick access to their usage stats without starting a session first.
 */
export default function DashboardShortcut() {
  const { dispatch } = useApp();
  return (
    <button
      onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'dashboard' })}
      className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100"
      aria-label="Go to dashboard"
    >
      <svg
        className="w-5 h-5 text-gray-600"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <rect width="7" height="9" x="3"  y="3"  rx="1" />
        <rect width="7" height="5" x="14" y="3"  rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3"  y="16" rx="1" />
      </svg>
    </button>
  );
}
