import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { generatePost } from '../lib/mockData';
import { HealthIcon, TimerBar, StoriesRow, PostCard } from '../components';
import { FeedHeader, BottomNav } from '../components/feed';
import SessionPanel from './SessionPanel';
import MentalBreak from './MentalBreak';

/** Number of posts loaded per batch (initial load and each infinite-scroll page) */
const BATCH = 8;

/**
 * Main Instagram-style feed screen with infinite scroll, in-session overlays,
 * a slide-up session panel, and the mental break interstitial.
 *
 * Conditional rendering of overlays is driven by persisted settings (Fix 5):
 *  - TimerBar shown only when persisted.enableTimerBar is true
 *  - HealthIcon shown only when persisted.enableHealthIcon is true
 */
export default function Feed() {
  const { state, dispatch } = useApp();
  const { showSessionPanel, persisted } = state;

  const [posts, setPosts] = useState(() =>
    Array.from({ length: BATCH }, (_, i) => generatePost(i))
  );
  const [nextIndex, setNextIndex] = useState(BATCH);
  const [loading, setLoading] = useState(false);
  const [showBreak, setShowBreak] = useState(false);

  const loaderRef = useRef(null);
  const feedRef = useRef(null);

  /**
   * Appends the next BATCH of generated posts.
   * Debounced by the `loading` flag to prevent concurrent requests.
   */
  const loadMore = useCallback(() => {
    if (loading) return;
    setLoading(true);
    // Simulate a brief network delay for realism
    setTimeout(() => {
      setPosts(prev => [
        ...prev,
        ...Array.from({ length: BATCH }, (_, i) => generatePost(prev.length + i)),
      ]);
      setNextIndex(n => n + BATCH);
      setLoading(false);
    }, 500);
  }, [loading]);

  // Infinite scroll: observe the sentinel div and load more when it enters the viewport
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    // Large rootMargin pre-fetches the next batch before the user reaches the bottom
    const obs = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: '500px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  /**
   * Dispatches a POST_VIEWED action each time a post's media loads.
   *
   * @param {boolean} isVideo - Whether the viewed post was a video.
   */
  function handlePostView(isVideo) {
    dispatch({ type: 'POST_VIEWED', isVideo });
  }

  // Mental break takes over the full screen when active
  if (showBreak) {
    return (
      <MentalBreak
        onReturn={() => setShowBreak(false)}
        breakMins={persisted?.mentalBreakMins ?? 5}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#fafafa] relative">
      {/* Instagram-style top bar */}
      <FeedHeader />

      {/* In-session countdown bar — only when enabled (Fix 5) */}
      {persisted?.enableTimerBar && <TimerBar />}

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

        {/* Sentinel element — IntersectionObserver triggers loadMore when visible */}
        <div ref={loaderRef} className="flex items-center justify-center py-8">
          {loading && (
            <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent spin-slow" />
          )}
        </div>
      </div>

      {/* Bottom navigation tab bar */}
      <BottomNav />

      {/* Floating health icon — only when enabled (Fix 5) */}
      {persisted?.enableHealthIcon && (
        <div className="absolute bottom-20 right-4 z-30">
          <HealthIcon onOpen={() => dispatch({ type: 'TOGGLE_SESSION_PANEL' })} />
        </div>
      )}

      {/* Slide-up session summary panel */}
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
