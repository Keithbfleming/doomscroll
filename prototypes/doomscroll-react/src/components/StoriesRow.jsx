import { useState } from 'react';
import { STORIES } from '../lib/mockData';

/**
 * Horizontally scrollable row of story avatars, displayed below the feed header.
 * Tapping a story marks it as viewed (the ring changes from coloured to gray).
 * Story data is local state seeded from mockData — viewing is not persisted.
 */
export default function StoriesRow() {
  const [stories, setStories] = useState(STORIES);

  /**
   * Marks the story at the given index as viewed, updating local state.
   *
   * @param {number} i - Index of the tapped story.
   */
  function markViewed(i) {
    setStories(prev => prev.map((s, idx) => idx === i ? { ...s, viewed: true } : s));
  }

  return (
    <div className="flex gap-4 px-3 py-3 overflow-x-auto scrollbar-hide bg-white border-b border-gray-200">
      {stories.map((story, i) => (
        <button
          key={story.name}
          className="flex flex-col items-center gap-1 flex-shrink-0"
          onClick={() => markViewed(i)}
          aria-label={`View ${story.name}'s story`}
        >
          {/* Ring colour: gradient = unviewed, gray = viewed, light gray = own story */}
          <div className={story.isOwn ? 'p-[2px] rounded-full bg-gray-300' : story.viewed ? 'story-ring-viewed' : 'story-ring'}>
            <div className="w-[56px] h-[56px] rounded-full overflow-hidden bg-white p-[2px]">
              {story.isOwn ? (
                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center relative">
                  <img
                    src="https://picsum.photos/seed/me/64/64"
                    alt="me"
                    className="w-full h-full rounded-full object-cover"
                  />
                  {/* Blue "+" badge for own story add button */}
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
              ) : (
                <img
                  src={`https://picsum.photos/seed/${story.seed}/64/64`}
                  alt={story.name}
                  className="w-full h-full rounded-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
          </div>
          <span className="text-[11px] text-gray-700 w-16 text-center truncate">{story.name}</span>
        </button>
      ))}
    </div>
  );
}
