/* ============================================
   DoomScroll — App Logic
   Feed generation, infinite scroll, interactions,
   and all three intervention systems
   ============================================ */

// ═══════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════

const USERS = [
    { username: 'alex.designs',     location: 'San Francisco, CA',   seed: 'alexd' },
    { username: 'travel_with_sam',  location: 'Bali, Indonesia',     seed: 'samtravel' },
    { username: 'devlife.io',       location: 'Austin, TX',          seed: 'devlife' },
    { username: 'foodie.jessica',   location: 'New York, NY',        seed: 'jessfood' },
    { username: 'sunset.chaser',    location: 'Los Angeles, CA',     seed: 'sunchase' },
    { username: 'urban.lens',       location: 'Chicago, IL',         seed: 'urbanlens' },
    { username: 'daily.grind',      location: 'Seattle, WA',         seed: 'grindcoffee' },
    { username: 'nature.frame',     location: 'Portland, OR',        seed: 'natureframe' },
    { username: 'code.and.coffee',  location: 'Denver, CO',          seed: 'codecoffee' },
    { username: 'minimal.spaces',   location: 'Brooklyn, NY',        seed: 'minspace' },
    { username: 'run.wild.co',      location: 'Boulder, CO',         seed: 'runwild' },
    { username: 'pixel.perfect',    location: 'Toronto, Canada',     seed: 'pixelp' },
    { username: 'good.eats.only',   location: 'Nashville, TN',       seed: 'goodeats' },
    { username: 'mountain.views',   location: 'Asheville, NC',       seed: 'mtnview' },
    { username: 'studio.light',     location: 'Atlanta, GA',         seed: 'studiolight' },
    { username: 'the.wanderer',     location: 'Lisbon, Portugal',    seed: 'wanderer' },
    { username: 'homebrew.dad',     location: 'Charlotte, NC',       seed: 'homebrew' },
    { username: 'plant.parent',     location: 'Austin, TX',          seed: 'plantparent' },
    { username: 'neon.nights',      location: 'Tokyo, Japan',        seed: 'neonnights' },
    { username: 'analog.film',      location: 'Berlin, Germany',     seed: 'analogfilm' },
];

const CAPTIONS = [
    "Golden hour hits different ✨",
    "Can't stop, won't stop scrolling 📱 (that's the problem)",
    "POV: you opened the app 'for a second' 45 minutes ago",
    "This feed isn't going to scroll itself... oh wait",
    "Lost track of time again. Worth it? Debatable.",
    "The algorithm knows me better than I know myself 🤖",
    "Just one more post... said me, 200 posts ago",
    "Caught this between scroll sessions 📸",
    "My screen time report is a horror story this week",
    "Endless content, endless scroll, endless... what was I doing?",
    "Taking a break from scrolling to post about scrolling 🔄",
    "Sunday mood 🌊",
    "Reset day but the feed never sleeps",
    "Trying to remember life before infinite scroll",
    "This is your sign to put the phone down. But first, like this 😂",
    "The light in this spot is unreal",
    "How did I get here? Oh right, I kept scrolling.",
    "3am scroll session. No regrets. Maybe some regrets.",
    "Content well never runs dry and that's both amazing and terrifying",
    "Here's a sunset as a reward for scrolling this far 🌅",
    "No filter needed when the world looks like this",
    "Caught the magic ✌️",
    "If you're reading this, you've scrolled too far",
    "Chasing light and good vibes",
    "Posted this so I'd finally stop editing it",
    "Proof I went outside today",
    "The kind of morning that makes you forget your phone. Almost.",
    "I don't always take photos, but when I do they end up here",
    "Autumn palette 🍂",
    "This spot. This moment. This is it.",
    "Morning coffee and zero urgency ☕",
    "Wish you were here (so I'd have someone to take my photo)",
    "Found this gem on a random walk",
    "That post-workout glow is real",
    "Living for this color palette right now 🎨",
    "Note to self: go outside more, scroll less",
    "Manifesting main character energy",
    "Be honest, how long have you been scrolling?",
    "Sometimes the best plan is no plan",
    "Plot twist: I didn't edit this one",
    "My feed is 90% food and I'm not sorry",
    "Currently accepting recommendations for my next obsession",
    "This corner of the internet is mine",
    "Couldn't pick a filter so I picked none",
    "The algorithm fed me this spot and it delivered",
    "Tell me you doom scroll without telling me you doom scroll",
    "One day I'll learn to just enjoy the moment without posting it",
    "Core memory: unlocked",
    "Good morning to everyone except my screen time notification",
    "Objectively, this slaps",
    "You know it's bad when even the loading spinner feels familiar",
    "Serotonin boost, courtesy of the algorithm",
    "Another day, another 3 hours of 'just checking' my phone",
    "Caught this one by accident, turned out better than anything I've planned",
    "Still thinking about this meal",
    "Friendly reminder that grass exists and it's touchable",
    "This app has a hold on me and I'm choosing not to examine that",
    "Hot take: sunsets never get old",
    "Going feral for this lighting",
    "Yes I took 47 photos to get this one",
];

// Free stock videos (Pexels CDN — royalty-free, no API key needed)
const VIDEOS = [
    { url: 'https://videos.pexels.com/video-files/3571264/3571264-sd_506_960_30fps.mp4', caption: 'Can\'t stop watching this 🌊' },
    { url: 'https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_30fps.mp4', caption: 'City never sleeps and neither do I apparently' },
    { url: 'https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_30fps.mp4', caption: 'Nature called. I scrolled past it.' },
    { url: 'https://videos.pexels.com/video-files/2491284/2491284-hd_1920_1080_24fps.mp4', caption: 'Loop this forever 🔁' },
    { url: 'https://videos.pexels.com/video-files/3209828/3209828-sd_506_960_25fps.mp4', caption: 'Caught the golden hour between scroll sessions' },
    { url: 'https://videos.pexels.com/video-files/1580507/1580507-hd_1920_1080_30fps.mp4', caption: 'The aesthetic is immaculate' },
    { url: 'https://videos.pexels.com/video-files/2795173/2795173-hd_1920_1080_30fps.mp4', caption: 'Lost in the vibes 🌅' },
    { url: 'https://videos.pexels.com/video-files/4763824/4763824-sd_506_960_24fps.mp4', caption: 'POV: you told yourself just five more minutes' },
    { url: 'https://videos.pexels.com/video-files/5752729/5752729-sd_506_960_25fps.mp4', caption: 'This hit different at 2am' },
    { url: 'https://videos.pexels.com/video-files/3048163/3048163-sd_506_960_25fps.mp4', caption: 'Endlessly watchable' },
];

const TIMESTAMPS = [
    '2 MINUTES AGO', '5 MINUTES AGO', '11 MINUTES AGO', '23 MINUTES AGO',
    '47 MINUTES AGO', '1 HOUR AGO', '2 HOURS AGO', '3 HOURS AGO',
    '5 HOURS AGO', '7 HOURS AGO', '11 HOURS AGO', '16 HOURS AGO',
    '1 DAY AGO', '2 DAYS AGO', '3 DAYS AGO', '4 DAYS AGO',
    '5 DAYS AGO', '6 DAYS AGO', '1 WEEK AGO',
];

const STORY_USERS = [
    { username: 'alex.d',     seed: 'salexd' },
    { username: 'sam_t',      seed: 'ssamt' },
    { username: 'jess.f',     seed: 'sjessf' },
    { username: 'devlife',    seed: 'sdevlife' },
    { username: 'sunset',     seed: 'ssunset' },
    { username: 'urban',      seed: 'surban' },
    { username: 'grind',      seed: 'sgrind' },
    { username: 'nature',     seed: 'snature' },
    { username: 'codebrew',   seed: 'scodebrew' },
    { username: 'minimal',    seed: 'sminimal' },
    { username: 'runner',     seed: 'srunner' },
    { username: 'pixels',     seed: 'spixels' },
    { username: 'wanderer',   seed: 'swanderer' },
    { username: 'neon',       seed: 'sneon' },
];

// Deterministic "random" based on seed number
function seededRandom(seed) {
    let x = Math.sin(seed * 9301 + 49297) * 49271;
    return x - Math.floor(x);
}

// ═══════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════

let postCount = 0;
let isLoading = false;
const POSTS_PER_BATCH = 8;

// Session / intervention state
let sessionStartTime = null;
let sessionTimerInterval = null;
let postsViewed = 0;

// Seatbelt state
let seatbeltLevel = 0;         // 0=none, 1=subtle glow, 2=notification, 3=shake+insistent
let seatbeltDismissCount = 0;
let seatbeltNotificationVisible = false;

// Grayscale state
let grayscaleActive = false;
let currentSaturation = 100;   // percentage
let grayscaleMessageShown = false;

// ═══════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    setupGate();
});

function setupGate() {
    const gateBtn = document.getElementById('gateStartBtn');
    gateBtn.addEventListener('click', startSession);
}

function startSession() {
    const gate = document.getElementById('gateScreen');
    const shell = document.getElementById('appShell');

    gate.classList.add('hidden');
    shell.style.display = 'block';

    setTimeout(() => {
        gate.style.display = 'none';
    }, 600);

    sessionStartTime = Date.now();

    renderStories();
    loadPosts();
    setupInfiniteScroll();
    startSessionTimer();
    startInterventionLoop();
}

// ═══════════════════════════════════════════
// STORIES
// ═══════════════════════════════════════════

function renderStories() {
    const container = document.getElementById('storiesScroll');

    STORY_USERS.forEach((user, i) => {
        const viewed = i > 5;
        const el = document.createElement('div');
        el.className = `story-item${viewed ? ' viewed' : ''}`;
        el.innerHTML = `
            <div class="story-ring">
                <div class="story-avatar">
                    <img src="https://picsum.photos/seed/${user.seed}/150/150" alt="${user.username}" loading="lazy">
                </div>
            </div>
            <span class="story-username">${user.username}</span>
        `;
        el.addEventListener('click', () => {
            el.classList.add('viewed');
        });
        container.appendChild(el);
    });
}

// ═══════════════════════════════════════════
// POSTS
// ═══════════════════════════════════════════

function createPost(index) {
    const user = USERS[index % USERS.length];
    const timestamp = TIMESTAMPS[Math.min(index, TIMESTAMPS.length - 1)];
    const rand = seededRandom(index);
    const likes = Math.floor(rand * 48000) + 127;
    const comments = Math.floor(seededRandom(index + 500) * 480) + 3;
    const isPortrait = index % 5 === 3;

    // Every 3rd or 4th post is a video
    const isVideo = (index % 4 === 2 || index % 7 === 5) && index < VIDEOS.length * 4;
    const videoData = isVideo ? VIDEOS[Math.floor(index / 4) % VIDEOS.length] : null;
    const caption = isVideo ? videoData.caption : CAPTIONS[index % CAPTIONS.length];

    const post = document.createElement('article');
    post.className = 'post';
    post.dataset.index = index;

    const imgSeed = index + 200;
    const imgW = 600;
    const imgH = isPortrait ? 750 : 600;
    const avatarUrl = `https://picsum.photos/seed/${user.seed}/80/80`;
    const imgUrl = `https://picsum.photos/seed/post${imgSeed}/${imgW}/${imgH}`;

    let mediaHTML;
    if (isVideo) {
        mediaHTML = `
        <div class="post-image-wrap video-post square">
            <video src="${videoData.url}" playsinline muted loop preload="metadata"
                   poster="https://picsum.photos/seed/vid${index}/600/600"></video>
            <div class="video-mute-btn" aria-label="Toggle sound">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
            </div>
            <div class="heart-overlay">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="0.5">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
            </div>
        </div>`;
    } else {
        mediaHTML = `
        <div class="post-image-wrap ${isPortrait ? 'landscape' : 'square'}">
            <img src="${imgUrl}" alt="Post by ${user.username}" loading="lazy">
            <div class="heart-overlay">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="0.5">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
            </div>
        </div>`;
    }

    post.innerHTML = `
        <div class="post-header">
            <div class="post-avatar">
                <img src="${avatarUrl}" alt="${user.username}" loading="lazy">
            </div>
            <div class="post-user-info">
                <div class="post-username">${user.username}</div>
                <div class="post-location">${user.location}</div>
            </div>
            <button class="post-more-btn" aria-label="More options">•••</button>
        </div>
        ${mediaHTML}
        <div class="post-actions">
            <div class="post-actions-left">
                <button class="action-btn like-btn" aria-label="Like">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                    </svg>
                </button>
                <button class="action-btn" aria-label="Comment">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                </button>
                <button class="action-btn" aria-label="Share">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                </button>
            </div>
            <button class="action-btn save-btn" aria-label="Save">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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

    // Video autoplay on scroll
    if (isVideo) {
        setupVideoAutoplay(post);
    }

    return post;
}

function setupPostInteractions(post, originalLikes) {
    const likeBtn = post.querySelector('.like-btn');
    const saveBtn = post.querySelector('.save-btn');
    const likesDisplay = post.querySelector('.post-likes');
    const imageWrap = post.querySelector('.post-image-wrap');
    const heartOverlay = post.querySelector('.heart-overlay');
    let isLiked = false;
    let isSaved = false;
    let lastTap = 0;

    likeBtn.addEventListener('click', () => {
        isLiked = !isLiked;
        likeBtn.classList.toggle('liked', isLiked);
        const count = isLiked ? originalLikes + 1 : originalLikes;
        likesDisplay.textContent = `${count.toLocaleString()} likes`;
    });

    saveBtn.addEventListener('click', () => {
        isSaved = !isSaved;
        saveBtn.classList.toggle('saved', isSaved);
    });

    // Double-tap to like
    imageWrap.addEventListener('click', () => {
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

    const delay = postCount === 0 ? 200 : 600;

    setTimeout(() => {
        const feed = document.getElementById('feed');
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < POSTS_PER_BATCH; i++) {
            fragment.appendChild(createPost(postCount + i));
        }

        feed.appendChild(fragment);
        postCount += POSTS_PER_BATCH;
        postsViewed = postCount;
        isLoading = false;
        spinner.style.display = 'none';
    }, delay);
}

// ═══════════════════════════════════════════
// INFINITE SCROLL
// ═══════════════════════════════════════════

function setupInfiniteScroll() {
    const sentinel = document.getElementById('loadingSpinner');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoading) {
                loadPosts();
            }
        }, { rootMargin: '600px' });
        observer.observe(sentinel);
    } else {
        window.addEventListener('scroll', () => {
            if (isLoading) return;
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
                loadPosts();
            }
        }, { passive: true });
    }
}

// ═══════════════════════════════════════════
// VIDEO AUTOPLAY ON SCROLL
// ═══════════════════════════════════════════

function setupVideoAutoplay(post) {
    const video = post.querySelector('video');
    const muteBtn = post.querySelector('.video-mute-btn');
    if (!video) return;

    // Autoplay when visible, pause when not
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.5 });
    observer.observe(video);

    // Mute toggle
    if (muteBtn) {
        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            video.muted = !video.muted;
            muteBtn.innerHTML = video.muted
                ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>'
                : '<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-3.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
        });
    }
}

// ═══════════════════════════════════════════
// SESSION TIMER (Intervention 1)
// ═══════════════════════════════════════════

function startSessionTimer() {
    const timerEl = document.getElementById('sessionTimer');
    const barEl = document.getElementById('sessionTimerBar');
    const textEl = document.getElementById('sessionTimerText');
    const SESSION_LIMIT = 15 * 60; // 15 minutes in seconds

    sessionTimerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        const progress = Math.min((elapsed / SESSION_LIMIT) * 100, 100);

        // Show timer bar after 30 seconds
        if (elapsed >= 30) {
            timerEl.classList.add('visible');
            barEl.style.width = `${progress}%`;
        }

        // Expand to show text after 45 seconds
        if (elapsed >= 45) {
            timerEl.classList.add('expanded');
            const mins = Math.floor(elapsed / 60);
            const secs = elapsed % 60;
            const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;
            const remaining = SESSION_LIMIT - elapsed;
            const remMins = Math.floor(Math.max(0, remaining) / 60);
            const remSecs = Math.max(0, remaining) % 60;
            const remStr = `${remMins}:${remSecs.toString().padStart(2, '0')}`;

            if (remaining > 0) {
                textEl.textContent = `⏱ ${timeStr} elapsed · ${remStr} remaining`;
            } else {
                textEl.textContent = `⏱ ${timeStr} — Session time expired`;
                textEl.style.color = '#ff6b6b';
            }
        }
    }, 1000);
}

// ═══════════════════════════════════════════
// INTERVENTION LOOP
// ═══════════════════════════════════════════

function startInterventionLoop() {
    setInterval(() => {
        const elapsed = sessionStartTime ? (Date.now() - sessionStartTime) / 1000 : 0;
        updateSeatbelt(elapsed);
        updateGrayscale(elapsed);
    }, 1000);
}

// ═══════════════════════════════════════════
// SEATBELT FEEDBACK (Intervention 2)
// ═══════════════════════════════════════════

function updateSeatbelt(elapsedSec) {
    const border = document.getElementById('seatbeltBorder');
    const notification = document.getElementById('seatbeltNotification');

    // Level 1: Subtle border glow (45s or 8 posts)
    if ((elapsedSec >= 45 || postsViewed >= 8) && seatbeltLevel < 1) {
        seatbeltLevel = 1;
        border.className = 'seatbelt-border level-1';
    }

    // Level 2: Notification slide-down (60s or 10 posts)
    if ((elapsedSec >= 60 || postsViewed >= 10) && seatbeltLevel < 2) {
        seatbeltLevel = 2;
        border.className = 'seatbelt-border level-2';
        showSeatbeltNotification(
            "You've been scrolling for a while",
            "Take a break?"
        );
    }

    // Level 3: Shake + insistent (90s or 15 posts)
    if ((elapsedSec >= 90 || postsViewed >= 15) && seatbeltLevel < 3) {
        seatbeltLevel = 3;
        border.className = 'seatbelt-border level-3';
        triggerShake();
        showSeatbeltNotification(
            "Still scrolling?",
            `You've been here ${Math.floor(elapsedSec / 60)}+ min. Your eyes need a break.`
        );
    }

    // After dismiss at level 3, keep re-triggering periodically
    if (seatbeltLevel >= 3 && !seatbeltNotificationVisible) {
        const timeSinceLevel3 = elapsedSec - 90;
        // Re-trigger every 30 seconds, getting more frequent with dismissals
        const interval = Math.max(15, 30 - (seatbeltDismissCount * 5));
        if (timeSinceLevel3 > 0 && timeSinceLevel3 % interval < 1.5) {
            triggerShake();
            const mins = Math.floor(elapsedSec / 60);
            showSeatbeltNotification(
                `${mins} minutes of scrolling`,
                "Seriously, take a break. Your future self will thank you."
            );
        }
    }
}

function showSeatbeltNotification(title, message) {
    const notification = document.getElementById('seatbeltNotification');
    const titleEl = document.getElementById('seatbeltTitle');
    const msgEl = document.getElementById('seatbeltMessage');
    const dismissBtn = document.getElementById('seatbeltDismiss');

    titleEl.textContent = title;
    msgEl.textContent = message;
    notification.classList.add('visible');
    seatbeltNotificationVisible = true;

    // Remove old listener and add new
    const newDismiss = dismissBtn.cloneNode(true);
    dismissBtn.parentNode.replaceChild(newDismiss, dismissBtn);
    newDismiss.addEventListener('click', () => {
        notification.classList.remove('visible');
        seatbeltNotificationVisible = false;
        seatbeltDismissCount++;
    });

    // Auto-dismiss after a while (but comes back)
    setTimeout(() => {
        notification.classList.remove('visible');
        seatbeltNotificationVisible = false;
    }, 8000);
}

function triggerShake() {
    const shell = document.getElementById('appShell');
    shell.classList.add('seatbelt-shake');
    setTimeout(() => {
        shell.classList.remove('seatbelt-shake');
    }, 500);
}

// ═══════════════════════════════════════════
// GRAYSCALE DEGRADATION (Intervention 3)
// ═══════════════════════════════════════════

function updateGrayscale(elapsedSec) {
    const shell = document.getElementById('appShell');
    const indicator = document.getElementById('grayscaleIndicator');
    const barFill = document.getElementById('grayscaleBarFill');
    const percentText = document.getElementById('grayscalePercent');
    const messageOverlay = document.getElementById('grayscaleMessage');

    // Start grayscale degradation at 60 seconds or 12 posts
    if (elapsedSec < 60 && postsViewed < 12) return;

    if (!grayscaleActive) {
        grayscaleActive = true;
        indicator.classList.add('visible');
    }

    // Calculate saturation: degrade from 100% to 0% over ~120 seconds after activation
    const activationTime = 60;
    const degradeDuration = 120; // seconds to go from 100% to 0%
    const timeInDegradation = elapsedSec - activationTime;
    const progress = Math.min(timeInDegradation / degradeDuration, 1);

    currentSaturation = Math.max(0, Math.round(100 - (progress * 100)));

    // Apply grayscale via CSS custom property
    shell.style.setProperty('--grayscale', (1 - currentSaturation / 100).toString());

    // Update indicator
    barFill.style.width = `${currentSaturation}%`;
    percentText.textContent = `${currentSaturation}%`;

    // When fully grayscale, show the message (once)
    if (currentSaturation <= 0 && !grayscaleMessageShown) {
        grayscaleMessageShown = true;
        messageOverlay.classList.add('visible');

        const dismissBtn = document.getElementById('grayscaleDismissBtn');
        dismissBtn.addEventListener('click', () => {
            messageOverlay.classList.remove('visible');
        });
    }
}

// ═══════════════════════════════════════════
// CONSOLE LOGGING (for research)
// ═══════════════════════════════════════════

setInterval(() => {
    if (!sessionStartTime) return;
    const elapsed = ((Date.now() - sessionStartTime) / 1000).toFixed(0);
    const mins = (elapsed / 60).toFixed(1);
    console.log(
        `[DoomScroll] Posts: ${postCount} | Time: ${mins}m | ` +
        `Seatbelt: L${seatbeltLevel} (dismissed: ${seatbeltDismissCount}) | ` +
        `Saturation: ${currentSaturation}%`
    );
}, 10000);
