import { AppProvider, useApp } from './context/AppContext';
import PreSession from './screens/PreSession';
import Feed from './screens/Feed';
import Dashboard from './screens/Dashboard';
import HomeScreen from './screens/HomeScreen';

/**
 * Fixed-size phone frame that constrains all child screens to a realistic
 * mobile viewport (390×844 px). Uses `overflow: hidden` — all modals and
 * overlays inside must use `position: absolute` rather than `position: fixed`.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
function PhoneFrame({ children }) {
  return (
    <div className="phone-frame flex flex-col">
      {children}
    </div>
  );
}

/**
 * Top-level screen router driven by `state.screen` from AppContext.
 * New screens must be added here in addition to being dispatched from components.
 *
 * Supported screens:
 *  'homescreen' — fake iPhone home screen (shown when user "closes" the app)
 *  'preSession' — intention + balance check (default / fallback)
 *  'feed'       — main Instagram-style feed
 *  'dashboard'  — usage stats and settings
 */
function Router() {
  const { state } = useApp();
  const { screen } = state;

  switch (screen) {
    case 'homescreen': return <HomeScreen />;
    case 'feed':       return <Feed />;
    case 'dashboard':  return <Dashboard />;
    default:           return <PreSession />;
  }
}

/**
 * Root application component.
 * Wraps everything in AppProvider (global state) and PhoneFrame (visual container).
 */
export default function App() {
  return (
    <AppProvider>
      <PhoneFrame>
        <Router />
      </PhoneFrame>
    </AppProvider>
  );
}
