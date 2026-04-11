/* DoomScroll — Instagram Base Feed */

const USERS = [
    { username: 'alex.designs',    location: 'San Francisco, CA',  seed: 'alexd' },
    { username: 'travel_with_sam', location: 'Bali, Indonesia',    seed: 'samtravel' },
    { username: 'devlife.io',      location: 'Austin, TX',         seed: 'devlife' },
    { username: 'foodie.jessica',  location: 'New York, NY',       seed: 'jessfood' },
    { username: 'sunset.chaser',   location: 'Los Angeles, CA',    seed: 'sunchase' },
    { username: 'urban.lens',      location: 'Chicago, IL',        seed: 'urbanlens' },
    { username: 'daily.grind',     location: 'Seattle, WA',        seed: 'grindcoffee' },
    { username: 'nature.frame',    location: 'Portland, OR',       seed: 'natureframe' },
    { username: 'code.and.coffee', location: 'Denver, CO',         seed: 'codecoffee' },
    { username: 'minimal.spaces',  location: 'Brooklyn, NY',       seed: 'minspace' },
    { username: 'run.wild.co',     location: 'Boulder, CO',        seed: 'runwild' },
    { username: 'pixel.perfect',   location: 'Toronto, Canada',    seed: 'pixelp' },
    { username: 'good.eats.only',  location: 'Nashville, TN',      seed: 'goodeats' },
    { username: 'mountain.views',  location: 'Asheville, NC',      seed: 'mtnview' },
    { username: 'studio.light',    location: 'Atlanta, GA',        seed: 'studiolight' },
    { username: 'the.wanderer',    location: 'Lisbon, Portugal',   seed: 'wanderer' },
    { username: 'homebrew.dad',    location: 'Charlotte, NC',      seed: 'homebrew' },
    { username: 'plant.parent',    location: 'Austin, TX',         seed: 'plantparent' },
    { username: 'neon.nights',     location: 'Tokyo, Japan',       seed: 'neonnights' },
    { username: 'analog.film',     location: 'Berlin, Germany',    seed: 'analogfilm' },
];

const CAPTIONS = [
    "Golden hour hits different ✨",
    "Can't stop, won't stop scrolling 📱",
    "POV: you opened the app 'for a second' 45 minutes ago",
    "This feed isn't going to scroll itself... oh wait",
    "Lost track of time again. Worth it? Debatable.",
    "The algorithm knows me better than I know myself 🤖",
    "Just one more post... said me, 200 posts ago",
    "Caught this between scroll sessions 📸",
    "My screen time report is a horror story this week",
    "Endless content, endless scroll, endless...",
    "Taking a break from scrolling to post about scrolling 🔄",
    "Sunday mood 🌊",
    "Reset day but the feed never sleeps",
    "Trying to remember life before infinite scroll",
    "This is your sign to put the phone down. But first, like this 😂",
    "The light in this spot is unreal",
    "How did I get here? Oh right, I kept scrolling.",
    "3am scroll session. No regrets. Maybe some regrets.",
    "Here's a sunset as a reward for scrolling this far 🌅",
    "No filter needed when the world looks like this",
    "Caught the magic ✌️",
    "If you're reading this, you've scrolled too far",
    "Chasing light and good vibes",
    "Posted this so I'd finally stop editing it",
    "Proof I went outside today",
    "Morning coffee and zero urgency ☕",
    "Wish you were here (so I'd have someone to take my photo)",
    "Found this gem on a random walk",
    "That post-workout glow is real",
    "Living for this color palette right now 🎨",
    "Note to self: go outside more, scroll less",
    "Be honest, how long have you been scrolling?",
    "Sometimes the best plan is no plan",
    "Plot twist: I didn't edit this one",
    "My feed is 90% food and I'm not sorry",
    "This corner of the internet is mine",
    "Couldn't pick a filter so I picked none",
    "Tell me you doom scroll without telling me you doom scroll",
    "Core memory: unlocked",
    "Good morning to everyone except my screen time notification",
    "Serotonin boost, courtesy of the algorithm",
    "Another day, another 3 hours of 'just checking' my phone",
    "Still thinking about this meal",
    "Friendly reminder that grass exists and it's touchable",
    "Hot take: sunsets never get old",
    "Yes I took 47 photos to get this one",
    "Autumn palette 🍂",
    "This spot. This moment. This is it.",
    "Manifesting main character energy",
    "Going feral for this lighting",
    "The kind of morning that makes you forget your phone. Almost.",
    "Objectively, this slaps",
    "Content well never runs dry and that's terrifying",
    "Caught this one by accident, best photo I've ever taken",
    "You know it's bad when even the loading spinner feels familiar",
    "I don't always take photos, but when I do they end up here",
    "This app has a hold on me and I'm choosing not to examine that",
    "One day I'll learn to just enjoy the moment without posting it",
    "Currently accepting recommendations for my next obsession",
    "The algorithm fed me this spot and it delivered",
];

const TIMESTAMPS = [
    '2 MINUTES AGO', '5 MINUTES AGO', '11 MINUTES AGO', '23 MINUTES AGO',
    '47 MINUTES AGO', '1 HOUR AGO', '2 HOURS AGO', '3 HOURS AGO',
    '5 HOURS AGO', '7 HOURS AGO', '11 HOURS AGO', '16 HOURS AGO',
    '1 DAY AGO', '2 DAYS AGO', '3 DAYS AGO', '4 DAYS AGO',
    '5 DAYS AGO', '6 DAYS AGO', '1 WEEK AGO',
];

const STORY_USERS = [
    'alex.d', 'sam_t', 'jess.f', 'devlife', 'sunset', 'urban',
    'grind', 'nature', 'codebrew', 'minimal', 'runner', 'pixels',
    'wanderer', 'neon',
];

const VIDEOS = [
    'https://assets.mixkit.co/videos/1164/1164-720.mp4',
    'https://assets.mixkit.co/videos/4883/4883-720.mp4',
    'https://assets.mixkit.co/videos/34563/34563-720.mp4',
    'https://assets.mixkit.co/videos/34487/34487-720.mp4',
    'https://assets.mixkit.co/videos/34404/34404-720.mp4',
    'https://assets.mixkit.co/videos/51585/51585-720.mp4',
    'https://assets.mixkit.co/videos/52178/52178-720.mp4',
    'https://assets.mixkit.co/videos/41587/41587-720.mp4',
    'https://assets.mixkit.co/videos/28780/28780-720.mp4',
    'https://assets.mixkit.co/videos/22712/22712-720.mp4',
    'https://assets.mixkit.co/videos/4394/4394-720.mp4',
    'https://assets.mixkit.co/videos/18289/18289-720.mp4',
    'https://assets.mixkit.co/videos/32809/32809-720.mp4',
    'https://assets.mixkit.co/videos/3089/3089-720.mp4',
    'https://assets.mixkit.co/videos/1943/1943-720.mp4',
    'https://assets.mixkit.co/videos/42464/42464-720.mp4',
    'https://assets.mixkit.co/videos/28398/28398-720.mp4',
    'https://assets.mixkit.co/videos/12982/12982-720.mp4',
    'https://assets.mixkit.co/videos/40813/40813-720.mp4',
    'https://assets.mixkit.co/videos/4063/4063-720.mp4',
];

// ── helpers ──
function seededRand(n) {
    let x = Math.sin(n * 9301 + 49297) * 49271;
    return x - Math.floor(x);
}

// ── state ──
let postCount = 0;
let loading = false;
let balanceSeconds = 12 * 60; // 12 minutes in seconds
let sessionInterval = null;

// ── init ──
document.addEventListener('DOMContentLoaded', () => {
    setupGate();
    renderStories();
    loadPosts();
    setupInfiniteScroll();
});

// ── gate ──
function setupGate() {
    const card = document.getElementById('balanceCard');
    const openBtn = document.getElementById('gateOpenBtn');
    const chips = document.querySelectorAll('.intention-chip');
    const freeInput = document.getElementById('intentionFree');

    // Balance card expand/collapse
    card.addEventListener('click', () => {
        card.classList.toggle('expanded');
    });

    // Activities modal
    const modal = document.getElementById('activitiesModal');
    const modalClose = document.getElementById('modalCloseBtn');
    const changeBtn = document.getElementById('changeActivitiesBtn');
    const viewBtn = document.getElementById('viewActivitiesBtn');

    function openModal(e) {
        e.stopPropagation();
        modal.classList.add('visible');
    }

    changeBtn.addEventListener('click', openModal);
    viewBtn.addEventListener('click', openModal);

    modalClose.addEventListener('click', () => {
        modal.classList.remove('visible');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('visible');
    });

    // Intention chip selection
    chips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            e.stopPropagation();
            chips.forEach(c => c.classList.remove('selected'));
            chip.classList.add('selected');
            freeInput.value = '';
            freeInput.classList.remove('has-text');
            unlockButton();
        });
    });

    // Free text input
    freeInput.addEventListener('click', (e) => e.stopPropagation());
    freeInput.addEventListener('input', () => {
        if (freeInput.value.trim()) {
            chips.forEach(c => c.classList.remove('selected'));
            freeInput.classList.add('has-text');
            unlockButton();
        } else {
            freeInput.classList.remove('has-text');
            lockButton();
        }
    });

    function unlockButton() {
        openBtn.classList.remove('disabled');
        openBtn.disabled = false;
    }

    function lockButton() {
        if (!document.querySelector('.intention-chip.selected') && !freeInput.value.trim()) {
            openBtn.classList.add('disabled');
            openBtn.disabled = true;
        }
    }

    // Open Instagram button → show confirmation
    const overlay = document.getElementById('confirmOverlay');
    const cancelBtn = document.getElementById('confirmCancel');
    const goBtn = document.getElementById('confirmGo');

    openBtn.addEventListener('click', () => {
        document.getElementById('confirmMinutes').textContent = document.getElementById('balanceNumber').textContent;
        overlay.classList.add('visible');
    });

    cancelBtn.addEventListener('click', () => {
        overlay.classList.remove('visible');
    });

    // Confirm → transition to Instagram feed + start timer
    goBtn.addEventListener('click', () => {
        overlay.classList.remove('visible');
        const gate = document.getElementById('gateScreen');
        const igApp = document.getElementById('igApp');

        gate.classList.add('hidden');
        igApp.style.display = 'flex';

        setTimeout(() => {
            gate.style.display = 'none';
        }, 500);

        startSessionTimer();
    });
}

// ── session timer ──
function startSessionTimer() {
    const timerEl = document.getElementById('sessionTimer');
    const fillEl = document.getElementById('timerBarFill');
    const textEl = document.getElementById('timerText');
    const totalSeconds = balanceSeconds;
    const SPEED = 30;

    sessionInterval = setInterval(() => {
        balanceSeconds -= SPEED;

        if (balanceSeconds >= 0) {
            const mins = Math.floor(balanceSeconds / 60);
            const secs = balanceSeconds % 60;
            textEl.textContent = `⏱ ${mins}:${secs.toString().padStart(2, '0')} remaining · ${SPEED}x`;
            fillEl.style.width = `${(balanceSeconds / totalSeconds) * 100}%`;
        } else {
            clearInterval(sessionInterval);
            balanceSeconds = 0;
            returnToGateBlocked();
        }
    }, 1000);
}

// ── return to gate (blocked state) ──
function returnToGateBlocked() {
    const gate = document.getElementById('gateScreen');
    const igApp = document.getElementById('igApp');
    const balanceNum = document.getElementById('balanceNumber');
    const intentionSection = document.getElementById('intentionSection');
    const openBtn = document.getElementById('gateOpenBtn');
    const blockedSection = document.getElementById('blockedSection');
    const timerEl = document.getElementById('sessionTimer');

    // Reset timer visual
    timerEl.classList.remove('overtime');

    // Switch to blocked state
    balanceNum.textContent = '0';
    intentionSection.style.display = 'none';
    openBtn.style.display = 'none';
    blockedSection.style.display = 'flex';

    // Clear intention selections
    document.querySelectorAll('.intention-chip').forEach(c => c.classList.remove('selected'));
    const freeInput = document.getElementById('intentionFree');
    if (freeInput) { freeInput.value = ''; freeInput.classList.remove('has-text'); }

    // Show gate, hide feed
    igApp.style.display = 'none';
    gate.style.display = '';
    gate.classList.remove('hidden');
}

// ── stories ──
function renderStories() {
    const container = document.getElementById('storiesScroll');
    STORY_USERS.forEach((name, i) => {
        const el = document.createElement('div');
        el.className = `story-item${i > 5 ? ' viewed' : ''}`;
        el.innerHTML = `
            <div class="story-ring">
                <img class="story-avatar" src="https://picsum.photos/seed/s${name}/150/150" alt="${name}">
            </div>
            <span class="story-name">${name}</span>`;
        el.onclick = () => el.classList.add('viewed');
        container.appendChild(el);
    });
}

// ── posts ──
function createPost(i) {
    const user = USERS[i % USERS.length];
    const caption = CAPTIONS[i % CAPTIONS.length];
    const ts = TIMESTAMPS[Math.min(i, TIMESTAMPS.length - 1)];
    const likes = Math.floor(seededRand(i) * 48000) + 127;
    const comments = Math.floor(seededRand(i + 500) * 480) + 3;

    // Every other post is a video (~50%)
    const isVideo = i % 2 === 1;
    const videoSrc = VIDEOS[Math.floor(i / 2) % VIDEOS.length];

    // Vary aspect ratio
    const isPortrait = !isVideo && i % 5 === 3;
    const ratio = isPortrait ? 'portrait' : 'square';

    const avatarUrl = `https://picsum.photos/seed/${user.seed}/80/80`;
    const imgUrl = `https://picsum.photos/seed/p${i + 200}/600/${isPortrait ? 750 : 600}`;

    const mediaHTML = isVideo
        ? `<div class="post-media square">
               <video src="${videoSrc}" playsinline muted loop preload="metadata"
                      poster="https://picsum.photos/seed/v${i}/600/600"></video>
               <button class="video-mute" aria-label="Toggle sound">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
               </button>
               <div class="heart-pop"><svg width="80" height="80" viewBox="0 0 24 24" fill="white"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></div>
           </div>`
        : `<div class="post-media ${ratio}">
               <img src="${imgUrl}" alt="Post by ${user.username}" loading="lazy">
               <div class="heart-pop"><svg width="80" height="80" viewBox="0 0 24 24" fill="white"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></div>
           </div>`;

    const el = document.createElement('article');
    el.className = 'post';
    el.innerHTML = `
        <div class="post-header">
            <img class="post-avatar" src="${avatarUrl}" alt="${user.username}" loading="lazy">
            <div class="post-user-info">
                <div class="post-username">${user.username}</div>
                <div class="post-location">${user.location}</div>
            </div>
            <button class="post-more" aria-label="More">•••</button>
        </div>
        ${mediaHTML}
        <div class="post-actions">
            <div class="post-actions-left">
                <button class="action-btn like-btn" aria-label="Like">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                </button>
                <button class="action-btn" aria-label="Comment">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                </button>
                <button class="action-btn" aria-label="Share">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
            </div>
            <button class="action-btn save-btn" aria-label="Save">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
            </button>
        </div>
        <div class="post-likes">${likes.toLocaleString()} likes</div>
        <div class="post-caption"><span class="cap-user">${user.username}</span>${caption}</div>
        <div class="post-comments">View all ${comments} comments</div>
        <div class="post-time">${ts}</div>`;

    wirePost(el, likes, isVideo);
    return el;
}

function wirePost(el, origLikes, isVideo) {
    const likeBtn = el.querySelector('.like-btn');
    const saveBtn = el.querySelector('.save-btn');
    const likesEl = el.querySelector('.post-likes');
    const media = el.querySelector('.post-media');
    const heart = el.querySelector('.heart-pop');
    let liked = false, saved = false, lastTap = 0;

    likeBtn.onclick = () => {
        liked = !liked;
        likeBtn.classList.toggle('liked', liked);
        likesEl.textContent = `${(liked ? origLikes + 1 : origLikes).toLocaleString()} likes`;
    };
    saveBtn.onclick = () => { saved = !saved; saveBtn.classList.toggle('saved', saved); };

    // Double-tap to like
    media.addEventListener('click', () => {
        const now = Date.now();
        if (now - lastTap < 300) {
            if (!liked) { liked = true; likeBtn.classList.add('liked'); likesEl.textContent = `${(origLikes+1).toLocaleString()} likes`; }
            heart.classList.remove('show');
            void heart.offsetWidth;
            heart.classList.add('show');
        }
        lastTap = now;
    });

    // Video: autoplay on scroll + mute toggle
    if (isVideo) {
        const video = el.querySelector('video');
        const muteBtn = el.querySelector('.video-mute');
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => e.isIntersecting ? video.play().catch(()=>{}) : video.pause());
        }, { threshold: 0.5 });
        obs.observe(media);

        muteBtn.onclick = (e) => {
            e.stopPropagation();
            video.muted = !video.muted;
            muteBtn.innerHTML = video.muted
                ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>'
                : '<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-3.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
        };
    }
}

function loadPosts() {
    if (loading) return;
    loading = true;
    document.getElementById('loader').style.opacity = '1';

    setTimeout(() => {
        const feed = document.getElementById('feed');
        const frag = document.createDocumentFragment();
        for (let i = 0; i < 8; i++) frag.appendChild(createPost(postCount + i));
        feed.appendChild(frag);
        postCount += 8;
        loading = false;
        document.getElementById('loader').style.opacity = '0';
    }, postCount === 0 ? 200 : 500);
}

// ── infinite scroll ──
function setupInfiniteScroll() {
    const scrollArea = document.getElementById('scrollArea');

    scrollArea.addEventListener('scroll', () => {
        if (loading) return;
        const nearBottom = scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight < 500;
        if (nearBottom) loadPosts();
    }, { passive: true });
}
