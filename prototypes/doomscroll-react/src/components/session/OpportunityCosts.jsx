/**
 * Converts a post count to a physical scroll distance in feet.
 * Each post is assumed to occupy ~9 feet of vertical finger travel.
 *
 * @param {number} posts - Number of posts scrolled past.
 * @returns {number} Feet scrolled.
 */
function scrollFeet(posts) {
  return posts * 9;
}

/**
 * Maps elapsed session minutes to an alternative activity the user could have done.
 *
 * @param {number} mins - Elapsed minutes in the session.
 * @returns {string} A short description of what the time could have been used for.
 */
function timeMetaphor(mins) {
  if (mins < 5)  return 'read a couple pages of a book';
  if (mins < 10) return 'do a guided breathing exercise';
  if (mins < 20) return 'read a full chapter of a novel';
  if (mins < 30) return 'listen to a full album';
  if (mins < 45) return 'listen to a podcast episode';
  if (mins < 60) return 'go for a bike ride';
  return 'watch an entire movie';
}

/**
 * Converts a raw foot distance into a readable metaphor string.
 *
 * @param {number} feet - Total scroll distance in feet.
 * @returns {string}
 */
function distanceMetaphor(feet) {
  if (feet < 100) return 'length of a few parked cars';
  if (feet < 528) return `${Math.round(feet / 3)} yards — a city block`;
  return `${(feet / 5280).toFixed(1)} miles`;
}

/**
 * Side-by-side cards that reframe session data in relatable real-world terms:
 * how far the user "scrolled" in physical distance, and what they could have done instead.
 *
 * @param {object} props
 * @param {object} props.session - Live session state from AppContext.
 * @param {number} props.session.elapsedSec - Seconds elapsed.
 * @param {number} props.session.postCount - Posts viewed (drives the distance calculation).
 */
export default function OpportunityCosts({ session }) {
  const mins = Math.floor(session.elapsedSec / 60);
  const feet = scrollFeet(session.postCount);

  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      <div className="bg-amber-50 rounded-xl p-3">
        <p className="text-xs text-amber-700 font-medium mb-1">📏 Distance scrolled</p>
        <p className="text-sm font-bold text-amber-900">
          {feet < 5280 ? `${feet} ft` : `${(feet / 5280).toFixed(1)} mi`}
        </p>
        <p className="text-xs text-amber-600 mt-1">{distanceMetaphor(feet)}</p>
      </div>
      <div className="bg-purple-50 rounded-xl p-3">
        <p className="text-xs text-purple-700 font-medium mb-1">⏱ Instead you could've</p>
        <p className="text-xs font-semibold text-purple-900 leading-snug">{timeMetaphor(mins)}</p>
      </div>
    </div>
  );
}
