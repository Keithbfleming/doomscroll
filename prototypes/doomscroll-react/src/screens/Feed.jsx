import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { generatePost } from '../lib/mockData';
import PostCard from '../components/PostCard';
import StoriesRow from '../components/StoriesRow';
import HealthIcon, { TimerBar } from '../components/HealthIcon';
import SessionPanel from './SessionPanel';
import MentalBreak from './MentalBreak';

const BATCH = 8;

export default function Feed() {
  const { state, dispatch } = useApp();
  const { showSessionPanel } = state;
  const [posts, setPosts] = useState(() => Array.from({ length: BATCH }, (_, i) => generatePost(i)));
  const [nextIndex, setNextIndex] = useState(BATCH);
  const [loading, setLoading] = useState(false);
  const [showBreak, setShowBreak] = useState(false);
  const loaderRef = useRef(null);
  const feedRef = useRef(null);

  const loadMore = useCallback(() => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setPosts(prev => [
        ...prev,
        ...Array.from({ length: BATCH }, (_, i) => generatePost(prev.length + i)),
      ]);
      setNextIndex(n => n + BATCH);
      setLoading(false);
    }, 500);
  }, [loading]);

  // Infinite scroll observer
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadMore();
    }, { rootMargin: '500px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  function handlePostView(isVideo) {
    dispatch({ type: 'POST_VIEWED', isVideo });
  }

  if (showBreak) {
    return <MentalBreak onReturn={() => setShowBreak(false)} />;
  }

  return (
    <div className="flex flex-col h-full bg-[#fafafa] relative">
      {/* Instagram-style top bar */}
      <div className="flex items-center justify-between px-4 pt-10 pb-2 bg-white border-b border-gray-200">
        <span className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Grand Hotel', cursive, sans-serif" }}>
          Instagram
        </span>
        <div className="flex items-center gap-4">
          <button className="text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button className="text-gray-900 relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">3</span>
          </button>
        </div>
      </div>

      {/* Timer bar */}
      <TimerBar />

      {/* Scrollable feed */}
      <div ref={feedRef} className="flex-1 overflow-y-auto scrollbar-hide">
        <StoriesRow />

        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onView={handlePostView}
          />
        ))}

        {/* Loader sentinel */}
        <div ref={loaderRef} className="flex items-center justify-center py-8">
          {loading && (
            <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent spin-slow" />
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-around px-4 py-3 bg-white border-t border-gray-200">
        {[
          <svg key="home" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
          <svg key="search" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/></svg>,
          <svg key="add" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path strokeLinecap="round" d="M12 8v8M8 12h8"/></svg>,
          <svg key="reel" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon fill="currentColor" points="10,8 16,12 10,16"/></svg>,
          <div key="profile" className="w-6 h-6 rounded-full overflow-hidden bg-gray-200"><img src="https://picsum.photos/seed/me/48/48" alt="me" className="w-full h-full object-cover" /></div>,
        ].map((icon, i) => (
          <button key={i} className="text-gray-900 p-1">{icon}</button>
        ))}
      </div>

      {/* Floating health icon */}
      <div className="absolute bottom-20 right-4 z-30">
        <HealthIcon onOpen={() => dispatch({ type: 'TOGGLE_SESSION_PANEL' })} />
      </div>

      {/* Session panel */}
      {showSessionPanel && (
        <SessionPanel
          onClose={() => dispatch({ type: 'CLOSE_SESSION_PANEL' })}
          onBreak={() => {
            dispatch({ type: 'CLOSE_SESSION_PANEL' });
            setShowBreak(true);
          }}
          onDashboard={() => {
            dispatch({ type: 'END_SESSION' });
            dispatch({ type: 'SET_SCREEN', screen: 'dashboard' });
          }}
        />
      )}
    </div>
  );
}
