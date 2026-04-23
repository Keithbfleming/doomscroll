// Seeded random — consistent values across reloads
function seededRand(n) {
  return Math.abs(Math.sin(n * 9301 + 49297) * 49271) % 1;
}

export const USERS = [
  { username: 'alex.designs', location: 'San Francisco, CA', seed: 'alex' },
  { username: 'travel.maya', location: 'Bali, Indonesia', seed: 'maya' },
  { username: 'foodie.carlos', location: 'New York, NY', seed: 'carlos' },
  { username: 'fitness.jen', location: 'Austin, TX', seed: 'jen' },
  { username: 'photo.riku', location: 'Tokyo, Japan', seed: 'riku' },
  { username: 'art.sophie', location: 'Paris, France', seed: 'sophie' },
  { username: 'surf.kai', location: 'Honolulu, HI', seed: 'kai' },
  { username: 'coffee.lena', location: 'Portland, OR', seed: 'lena' },
  { username: 'dev.sam', location: 'Seattle, WA', seed: 'sam' },
  { username: 'hike.priya', location: 'Denver, CO', seed: 'priya' },
  { username: 'music.jax', location: 'Nashville, TN', seed: 'jax' },
  { username: 'cook.min', location: 'Chicago, IL', seed: 'min' },
  { username: 'run.felix', location: 'Boston, MA', seed: 'felix' },
  { username: 'style.zoe', location: 'Los Angeles, CA', seed: 'zoe' },
  { username: 'nature.hugo', location: 'Vancouver, BC', seed: 'hugo' },
];

export const CAPTIONS = [
  "Can't stop, won't stop scrolling 📱",
  "Just one more post... said me, 200 posts ago",
  "Living my best life one scroll at a time ✨",
  "Golden hour > everything else 🌅",
  "Coffee first, adulting second ☕",
  "This view though 😍",
  "Weekend vibes loading... 🔋",
  "Found my happy place 🌿",
  "Making memories that matter 💫",
  "Plot twist: I actually went outside today",
  "The best things in life aren't things 🌊",
  "Chasing sunsets and good conversations",
  "Life is short, eat the dessert 🍰",
  "Adventure awaits, allegedly",
  "Current mood: unbothered 😌",
  "Creating my own sunshine ☀️",
  "Not all those who wander are lost... but I might be",
  "Grateful for today's little wins 🙌",
  "In my main character era ✨",
  "Soft life, big dreams 🌙",
];

export const TIMESTAMPS = [
  '2 MINUTES AGO', '5 MINUTES AGO', '12 MINUTES AGO', '28 MINUTES AGO',
  '1 HOUR AGO', '2 HOURS AGO', '3 HOURS AGO', '5 HOURS AGO',
  '8 HOURS AGO', '10 HOURS AGO', '1 DAY AGO', '2 DAYS AGO', '3 DAYS AGO',
];

export const VIDEO_SRCS = [
  'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-woman-running-above-a-hat-in-the-park-1128-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smart-phone-with-a-beautiful-sunset-in-the-background-1238-large.mp4',
];

export const CONTENT_TAGS = ['Travel', 'Food', 'Fitness', 'Art', 'Music', 'Nature', 'Fashion', 'Tech', 'Lifestyle'];

export function generatePost(i) {
  const user = USERS[Math.floor(seededRand(i * 3) * USERS.length)];
  const isVideo = i % 2 === 1;
  const isPortrait = !isVideo && i % 5 === 3;
  const tag = CONTENT_TAGS[Math.floor(seededRand(i * 7) * CONTENT_TAGS.length)];

  return {
    id: i,
    user,
    isVideo,
    mediaType: isPortrait ? 'portrait' : 'square',
    videoSrc: isVideo ? VIDEO_SRCS[i % VIDEO_SRCS.length] : null,
    imageSrc: isVideo ? null : `https://picsum.photos/seed/post${i}/600/${isPortrait ? 750 : 600}`,
    posterImage: isVideo ? `https://picsum.photos/seed/vid${i}/600/600` : null,
    likes: Math.floor(seededRand(i) * 48000) + 127,
    comments: Math.floor(seededRand(i + 500) * 480) + 3,
    caption: CAPTIONS[Math.floor(seededRand(i * 2) * CAPTIONS.length)],
    timestamp: TIMESTAMPS[Math.floor(seededRand(i * 4) * TIMESTAMPS.length)],
    tag,
    liked: false,
    saved: false,
  };
}

export const STORIES = [
  { name: 'Your story', seed: 'me', isOwn: true, viewed: false },
  { name: 'alex.d', seed: 'alex', viewed: false },
  { name: 'maya', seed: 'maya', viewed: true },
  { name: 'carlos', seed: 'carlos', viewed: false },
  { name: 'jen', seed: 'jen', viewed: false },
  { name: 'riku', seed: 'riku', viewed: true },
  { name: 'sophie', seed: 'sophie', viewed: false },
  { name: 'kai', seed: 'kai', viewed: false },
  { name: 'lena', seed: 'lena', viewed: true },
  { name: 'sam', seed: 'sam', viewed: false },
  { name: 'priya', seed: 'priya', viewed: false },
  { name: 'jax', seed: 'jax', viewed: false },
  { name: 'min', seed: 'min', viewed: true },
  { name: 'felix', seed: 'felix', viewed: false },
];

export const WELLNESS_FACTS = [
  "The average person spends 2.5 hours per day on social media. That's 38 days a year.",
  "Taking a 5-minute break can restore focus and improve your overall productivity.",
  "Studies show that social media breaks improve mood and reduce anxiety.",
  "Looking away from screens every 20 minutes reduces eye strain significantly.",
  "Mindful usage of social media is linked to higher life satisfaction.",
  "Brief mental breaks strengthen memory consolidation and creativity.",
];

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
