import { useState, useRef } from 'react';

/**
 * Heart SVG icon used for the like button and the double-tap animation.
 *
 * @param {object} props
 * @param {boolean} props.filled - Whether to render the filled (liked) state.
 * @param {string} [props.className]
 */
function HeartIcon({ filled, className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? '#ed4956' : 'none'}
      stroke={filled ? '#ed4956' : 'currentColor'}
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

/** Bookmark icon for the save button. */
function BookmarkIcon({ filled }) {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill={filled ? '#262626' : 'none'} stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}

/** Comment bubble icon. */
function CommentIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

/** Share icon. */
function ShareIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      />
    </svg>
  );
}

/**
 * Formats large numbers with a "k" suffix (e.g. 1200 → "1.2k").
 *
 * @param {number} n
 * @returns {string}
 */
function formatNum(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

/**
 * A single post in the feed — photo or video with Instagram-style interactions.
 * Supports double-tap to like (350ms threshold), like/save toggles, and
 * fires the onView callback when the media loads (so the session tracker updates).
 *
 * @param {object} props
 * @param {object} props.post - Post data object from generatePost().
 * @param {function} [props.onView] - Called with `isVideo` (boolean) when media loads.
 */
export default function PostCard({ post, onView }) {
  const [liked, setLiked] = useState(post.liked);
  const [saved, setSaved] = useState(post.saved);
  const [likeBounce, setLikeBounce] = useState(false);
  const [heartPop, setHeartPop] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const lastTap = useRef(0);
  const videoRef = useRef(null);
  const cardRef = useRef(null);

  /** Toggle like state and trigger the bounce animation. */
  function handleLike() {
    const wasLiked = liked;
    setLiked(!liked);
    setLikeCount(c => wasLiked ? c - 1 : c + 1);
    setLikeBounce(true);
    setTimeout(() => setLikeBounce(false), 300);
  }

  /**
   * Detects a double-tap within 350ms and triggers a like + heart-pop animation.
   * Reuses the same like logic as the button to keep counts consistent.
   */
  function handleDoubleTap() {
    const now = Date.now();
    if (now - lastTap.current < 350) {
      if (!liked) {
        setLiked(true);
        setLikeCount(c => c + 1);
      }
      setHeartPop(true);
      setTimeout(() => setHeartPop(false), 800);
    }
    lastTap.current = now;
  }

  // Portrait posts use a 4:5 ratio; all other images use square
  const aspectClass = post.mediaType === 'portrait' ? 'aspect-[4/5]' : 'aspect-square';

  return (
    <article ref={cardRef} className="bg-white border-b border-gray-200">
      {/* Post header — avatar, username, location, options */}
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
            <img
              src={`https://picsum.photos/seed/${post.user.seed}/64/64`}
              alt={post.user.username}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-gray-900 leading-none">{post.user.username}</p>
            {post.user.location && (
              <p className="text-[11px] text-gray-500 mt-0.5">{post.user.location}</p>
            )}
          </div>
        </div>
        <button className="text-gray-700 p-1" aria-label="Post options">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Media — video or photo */}
      <div className={`relative w-full ${aspectClass} bg-gray-100 overflow-hidden`} onClick={handleDoubleTap}>
        {post.isVideo ? (
          <video
            ref={videoRef}
            src={post.videoSrc}
            poster={post.posterImage}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            onPlay={() => onView && onView(true)}
          />
        ) : (
          <img
            src={post.imageSrc}
            alt={post.caption}
            className="w-full h-full object-cover"
            loading="lazy"
            onLoad={() => onView && onView(false)}
          />
        )}

        {/* Double-tap heart animation */}
        {heartPop && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <HeartIcon filled className="w-24 h-24 text-white heart-pop drop-shadow-lg" />
          </div>
        )}
      </div>

      {/* Action row */}
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`text-gray-900 ${likeBounce ? 'like-bounce' : ''}`}
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <HeartIcon filled={liked} className="w-6 h-6" />
          </button>
          <button className="text-gray-900" aria-label="Comment"><CommentIcon /></button>
          <button className="text-gray-900" aria-label="Share"><ShareIcon /></button>
        </div>
        <button onClick={() => setSaved(!saved)} className="text-gray-900" aria-label={saved ? 'Unsave' : 'Save'}>
          <BookmarkIcon filled={saved} />
        </button>
      </div>

      {/* Like count */}
      <div className="px-3 pb-1">
        <p className="text-[13px] font-semibold text-gray-900">{formatNum(likeCount)} likes</p>
      </div>

      {/* Caption */}
      <div className="px-3 pb-1">
        <p className="text-[13px] text-gray-900">
          <span className="font-semibold">{post.user.username}</span>{' '}
          {post.caption}
        </p>
      </div>

      {/* Comments hint */}
      <div className="px-3 pb-1">
        <p className="text-[13px] text-gray-400">View all {formatNum(post.comments)} comments</p>
      </div>

      {/* Timestamp */}
      <div className="px-3 pb-3">
        <p className="text-[10px] text-gray-400 uppercase tracking-wide">{post.timestamp}</p>
      </div>
    </article>
  );
}
