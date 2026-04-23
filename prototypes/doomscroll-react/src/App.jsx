import { AppProvider, useApp } from './context/AppContext';
import PreSession from './screens/PreSession';
import Feed from './screens/Feed';
import Dashboard from './screens/Dashboard';

function PhoneFrame({ children }) {
  return (
    <div className="phone-frame flex flex-col">
      {children}
    </div>
  );
}

function Router() {
  const { state } = useApp();
  const { screen } = state;

  switch (screen) {
    case 'feed':      return <Feed />;
    case 'dashboard': return <Dashboard />;
    default:          return <PreSession />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <PhoneFrame>
        <Router />
      </PhoneFrame>
    </AppProvider>
  );
}
