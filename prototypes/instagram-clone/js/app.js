/* ============================================
   DoomScroll — App Logic
   Feed generation, infinite scroll, interactions
   ============================================ */

// ── Fake Data ──
const USERS = [
    { username: 'alex.designs', color: '#667eea', location: 'San Francisco, CA' },
    { username: 'travel_with_sam', color: '#f093fb', location: 'Bali, Indonesia' },
    { username: 'devlife.io', color: '#4facfe', location: 'Austin, TX' },
    { username: 'foodie.jessica', color: '#43e97b', location: 'New York, NY' },
    { username: 'sunset.chaser', color: '#fa709a', location: 'Los Angeles, CA' },
    { username: 'urban.lens', color: '#a18cd1', location: 'Chicago, IL' },
    { username: 'daily.grind', color: '#fccb90', location: 'Seattle, WA' },
    { username: 'nature.frame', color: '#30cfd0', location: 'Portland, OR' },
    { username: 'code.and.coffee', color: '#c471f5', location: 'Denver, CO' },
    { username: 'minimal.spaces', color: '#48c6ef', location: 'Brooklyn, NY' },
    { username: 'run.wild.co', color: '#f5576c', location: 'Boulder, CO' },
    { username: 'pixel.perfect', color: '#0250c5', location: 'Toronto, CA' },
    { username: 'good.eats.only', color: '#ff9a9e', location: 'Nashville, TN' },
    { username: 'mountain.views', color: '#a8edea', location: 'Asheville, NC' },
    { username: 'studio.light', color: '#d299c2', location: 'Atlanta, GA' },
];

const CAPTIONS = [
    "Golden hour hits different when you're not doom scrolling ✨",
    "Can't stop, won't stop 📱 (that's the problem)",
    "POV: you opened the app 'for a second' 45 minutes ago",
    "This feed isn't going to scroll itself... oh wait, it literally is",
    "Lost track of time again. Worth it? Debatable.",
    "The algorithm knows me better than I know myself at this point 🤖",
    "Just one more post... said me, 200 posts ago",
    "Caught this moment between scroll sessions 📸",
    "My screen time report is going to be brutal this week",
    "Endless content, endless scroll, endless... what was I doing?",
    "Taking a break from scrolling to post about scrolling 🔄",
    "The vibe today is impeccable 🌊",
    "Sunday reset but the feed never stops",
    "Trying to remember what I did before infinite scroll existed",
    "This is your sign to put the phone down. But first, like this post 😂",
    "Mindlessly beautiful, beautifully mindless",
    "How did I get here? Oh right, I kept scrolling.",
    "3am scroll session hits different (and not in a good way)",
    "The content well never runs dry and that's both amazing and terrifying",
    "You've been scrolling for a while. Here's a sunset as a reward 🌅",
];

// Seeded picsum URLs give consistent images per post
function postImageStyle(index) {
    const seed = index + 100;
    return `background-image: url('https://picsum.photos/seed/${seed}/600/600'); background-color: #efefef;`;
}

function postImageStyleLandscape(index) {
    const seed = index + 100;
    return `background-image: url('https://picsum.photos/seed/${seed}/800/600'); background-color: #efefef;`;
}

const TIMESTAMPS = [
    '2 minutes ago', '5 minutes ago', '12 minutes ago', '28 minutes ago',
    '1 hour ago', '2 hours ago', '3 hours ago', '5 hours ago',
    '8 hours ago', '12 hours ago', '1 day ago', '2 days ago',
    '3 days ago', '4 days ago', '5 days ago', '1 week ago',
];

const STORY_USERS = [
    { username: 'alex.d', color: '#667eea' },
    { username: 'sam_t', color: '#f093fb' },
    { username: 'jess.f', color: '#43e97b' },
    { username: 'devlife', color: '#4facfe' },
    { username: 'sunset', color: '#fa709a' },
    { username: 'urban', color: '#a18cd1' },
    { username: 'grind', color: '#fccb90' },
    { username: 'nature', color: '#30cfd0' },
    { username: 'codebrew', color: '#c471f5' },
    { username: 'minimal', color: '#48c6ef' },
    { username: 'runner', color: '#f5576c' },
    { username: 'pixels', color: '#0250c5' },
];

// ── State ──
let postCount = 0;
let isLoading = false;
let scrollDepthMax = 0;
const POSTS_PER_BATCH = 5;

// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
    renderStories();
    loadPosts();
    setupInfiniteScroll();
    setupScrollTracking();
});

// ── Stories ──
function renderStories() {
    const scrollContainer = document.querySelector('.stories-scroll');
    STORY_USERS.forEach((user, i) => {
        const viewed = i > 4;
        const storyEl = document.createElement('div');
        storyEl.className = `story-item${viewed ? ' viewed' : ''}`;
        storyEl.innerHTML = `
            <div class="story-ring">
                <div class="story-avatar" style="background-image: url('https://picsum.photos/seed/story${i}/80/80'); background-color: ${user.color};">
                </div>
            </div>
            <span class="story-username">${user.username}</span>
        `;
        storyEl.addEventListener('click', () => {
            storyEl.classList.add('viewed');
        });
        scrollContainer.appendChild(storyEl);
    });
}

// ── Posts ──
function createPost(index) {
    const user = USERS[index % USERS.length];
    const caption = CAPTIONS[index % CAPTIONS.length];
    const timestamp = TIMESTAMPS[Math.min(index, TIMESTAMPS.length - 1)];
    const likes = Math.floor(Math.random() * 50000) + 100;
    const comments = Math.floor(Math.random() * 500) + 1;
    const isLandscape = index % 7 === 0;

    const post = document.createElement('article');
    post.className = 'post';
    post.innerHTML = `
        <div class="post-header">
            <div class="post-avatar" style="background-image: url('https://picsum.photos/seed/user${index % USERS.length}/64/64'); background-size: cover; background-color: ${user.color};">
            </div>
            <div class="post-user-info">
                <div class="post-username">${user.username}</div>
                <div class="post-location">${user.location}</div>
            </div>
            <button class="post-more-btn" aria-label="More options">•••</button>
        </div>
        <div class="post-image-container${isLandscape ? ' landscape' : ''}" style="${isLandscape ? postImageStyleLandscape(index) : postImageStyle(index)}" data-post-index="${index}">
            <div class="heart-overlay">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            </div>
        </div>
        <div class="post-actions">
            <div class="post-actions-left">
                <button class="action-btn like-btn" aria-label="Like">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                </button>
                <button class="action-btn" aria-label="Comment">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                </button>
                <button class="action-btn" aria-label="Share">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                </button>
            </div>
            <button class="action-btn save-btn" aria-label="Save">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                </svg>
            </button>
        </div>
        <div class="post-likes">${likes.toLocaleString()} likes</div>
        <div class="post-caption">
            <span class="caption-username">${user.username}</span>${caption}
        </div>
        <div class="post-comments-link">View all ${comments} comments</div>
        <div class="post-timestamp">${timestamp}</div>
    `;

    setupPostInteractions(post, likes);
    return post;
}

function setupPostInteractions(post, originalLikes) {
    const likeBtn = post.querySelector('.like-btn');
    const saveBtn = post.querySelector('.save-btn');
    const likesDisplay = post.querySelector('.post-likes');
    const imageContainer = post.querySelector('.post-image-container');
    const heartOverlay = post.querySelector('.heart-overlay');
    let isLiked = false;
    let isSaved = false;
    let lastTap = 0;

    // Like button
    likeBtn.addEventListener('click', () => {
        isLiked = !isLiked;
        likeBtn.classList.toggle('liked', isLiked);
        const count = isLiked ? originalLikes + 1 : originalLikes;
        likesDisplay.textContent = `${count.toLocaleString()} likes`;
    });

    // Save button
    saveBtn.addEventListener('click', () => {
        isSaved = !isSaved;
        saveBtn.classList.toggle('saved', isSaved);
    });

    // Double-tap to like
    imageContainer.addEventListener('click', (e) => {
        const now = Date.now();
        if (now - lastTap < 300) {
            if (!isLiked) {
                isLiked = true;
                likeBtn.classList.add('liked');
                likesDisplay.textContent = `${(originalLikes + 1).toLocaleString()} likes`;
            }
            heartOverlay.classList.remove('animate');
            void heartOverlay.offsetWidth;
            heartOverlay.classList.add('animate');
        }
        lastTap = now;
    });
}

function loadPosts() {
    if (isLoading) return;
    isLoading = true;
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = 'flex';

    // Simulate network delay
    setTimeout(() => {
        const feed = document.getElementById('feed');
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < POSTS_PER_BATCH; i++) {
            fragment.appendChild(createPost(postCount + i));
        }

        feed.appendChild(fragment);
        postCount += POSTS_PER_BATCH;
        isLoading = false;
        spinner.style.display = 'none';
    }, postCount === 0 ? 300 : 800);
}

// ── Infinite Scroll ──
function setupInfiniteScroll() {
    const sentinel = document.getElementById('loadingSpinner');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoading) {
                loadPosts();
            }
        }, { rootMargin: '400px' });

        observer.observe(sentinel);
    } else {
        // Fallback for older browsers
        window.addEventListener('scroll', () => {
            if (isLoading) return;
            const scrollBottom = window.innerHeight + window.scrollY;
            if (scrollBottom >= document.body.offsetHeight - 800) {
                loadPosts();
            }
        }, { passive: true });
    }
}

// ── Scroll Depth Tracking (for research) ──
function setupScrollTracking() {
    let scrollTimer;
    const startTime = Date.now();

    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            if (scrollPercent > scrollDepthMax) {
                scrollDepthMax = scrollPercent;
            }

            const elapsedMinutes = ((Date.now() - startTime) / 60000).toFixed(1);

            // Log to console for research observation
            console.log(
                `[DoomScroll] Posts: ${postCount} | Scroll depth: ${scrollPercent}% (max: ${scrollDepthMax}%) | Time: ${elapsedMinutes}m`
            );
        }, 150);
    }, { passive: true });
}
