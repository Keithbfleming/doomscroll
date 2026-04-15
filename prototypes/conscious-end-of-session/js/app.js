/* DoomScroll — Conscious End of Session Prototype */

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

// Fake previous-days data (minutes) for Mon–Sat; today (index 6) filled at session end
const BASE_WEEKLY_DATA = [38, 52, 19, 64, 28, 41, 0];

// Fake session history for richer dashboard (day, duration in mins, mood 1-5, posts viewed)
const FAKE_SESSIONS = [
    { day: 'Mon', mins: 23, mood: 3, posts: 12 },
    { day: 'Tue', mins: 15, mood: 4, posts: 8  },
    { day: 'Wed', mins: 52, mood: 2, posts: 28 },
    { day: 'Thu', mins: 19, mood: 4, posts: 10 },
    { day: 'Fri', mins: 38, mood: 2, posts: 20 },
    { day: 'Sat', mins: 26, mood: 3, posts: 14 },
    { day: 'Sun', mins: 28, mood: 3, posts: 15 },
    { day: 'Sat', mins: 41, mood: 3, posts: 22 },
];

// ── helpers ──
function seededRand(n) {
    let x = Math.sin(n * 9301 + 49297) * 49271;
    return x - Math.floor(x);
}

function fmtMinSec(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

// ── state ──
let postCount = 0;
let loading = false;
let realSeconds = 0;       // real elapsed seconds
let sessionInterval = null;
const SPEED = 30;           // app minutes per real minute
const MIN_REAL_SECONDS = 10; // ~5 app-minutes at 30x; threshold to show overlay

// Dashboard state
let weeklyGoalMinutes = 120;
let accountabilityPartners = [];
let currentMoodRating = null; // set when user picks mood in overlay

// ── init ──
document.addEventListener('DOMContentLoaded', () => {
    renderStories();
    loadPosts();
    setupInfiniteScroll();
    startSessionTimer();
    setupEndSession();
    setupDashboard();
});

// ── session timer (count UP) ──
function startSessionTimer() {
    const textEl = document.getElementById('timerText');

    sessionInterval = setInterval(() => {
        realSeconds++;
        const appSeconds = realSeconds * SPEED;
        const appMins = Math.floor(appSeconds / 60);
        const appSecs = appSeconds % 60;
        textEl.textContent = `${appMins}:${appSecs.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopSessionTimer() {
    if (sessionInterval) {
        clearInterval(sessionInterval);
        sessionInterval = null;
    }
}

function getAppMinutes() {
    return (realSeconds * SPEED) / 60;
}

// ── opportunity cost copy ──
function getOpportunityCosts(appMins) {
    const mins = Math.round(appMins);

    // Distance metaphor based on posts scrolled
    const scrollFeet = Math.round(postCount * 9);
    let distCost;
    if (scrollFeet < 100) {
        distCost = { icon: '🚶', text: `You physically scrolled about ${scrollFeet} feet — the length of a few parked cars.` };
    } else if (scrollFeet < 528) {
        distCost = { icon: '🏙️', text: `You scrolled the equivalent of ${Math.round(scrollFeet / 3)} yards — almost a full city block.` };
    } else {
        const mi = (scrollFeet / 5280).toFixed(2);
        distCost = { icon: '🏃', text: `You scrolled the equivalent of a ${mi}-mile run — one thumb at a time.` };
    }

    // Time equivalence metaphor
    let timeCost;
    if (mins < 5) {
        timeCost = { icon: '📖', text: `${mins} minutes — enough to read a couple of pages in a book.` };
    } else if (mins < 10) {
        timeCost = { icon: '🧘', text: `${mins} minutes — the length of a guided breathing exercise.` };
    } else if (mins < 20) {
        timeCost = { icon: '📖', text: `${mins} minutes — enough to read a full chapter of a novel.` };
    } else if (mins < 30) {
        timeCost = { icon: '🎵', text: `${mins} minutes — you could have listened to a full album start to finish.` };
    } else if (mins < 45) {
        timeCost = { icon: '🎧', text: `${mins} minutes — the length of a podcast episode on something you've been meaning to learn.` };
    } else if (mins < 60) {
        timeCost = { icon: '🚴', text: `${mins} minutes — enough for a solid bike ride or a long walk outside.` };
    } else {
        timeCost = { icon: '🎬', text: `${mins} minutes — you could have watched an entire movie.` };
    }

    return [distCost, timeCost];
}

// ── end session ──
function setupEndSession() {
    const endBtn = document.getElementById('endSessionBtn');
    const overlay = document.getElementById('sessionOverlay');
    const closeBtn = document.getElementById('closeOverlayBtn');
    const dashBtn = document.getElementById('viewDashboardBtn');

    endBtn.addEventListener('click', () => {
        if (realSeconds < MIN_REAL_SECONDS) {
            showEarlyDismiss(endBtn);
            return;
        }
        stopSessionTimer();
        populateOverlay();
        overlay.classList.add('visible');
    });

    // Mood selection — also store rating for dashboard history
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            currentMoodRating = parseInt(btn.dataset.mood, 10);
        });
    });

    closeBtn.addEventListener('click', closeApp);

    dashBtn.addEventListener('click', () => {
        openDashboard();
    });
}

function showEarlyDismiss(anchor) {
    // Brief shake + tooltip — session too short
    anchor.style.transition = 'transform 0.1s';
    const shakes = [6, -6, 5, -5, 3, 0];
    let i = 0;
    const shake = setInterval(() => {
        anchor.style.transform = `translateX(${shakes[i]}px)`;
        i++;
        if (i >= shakes.length) {
            clearInterval(shake);
            anchor.style.transform = '';
        }
    }, 60);

    // Show a tiny tooltip label above the button
    const tip = document.createElement('div');
    tip.textContent = 'Scroll a bit more first';
    tip.style.cssText = `
        position: fixed;
        background: rgba(38,38,38,0.9);
        color: #fff;
        font-size: 12px;
        padding: 6px 12px;
        border-radius: 8px;
        pointer-events: none;
        z-index: 999;
        white-space: nowrap;
        font-family: -apple-system, sans-serif;
    `;
    const rect = anchor.getBoundingClientRect();
    // place inside the phone-screen
    const phoneScreen = document.querySelector('.phone-screen');
    const psRect = phoneScreen.getBoundingClientRect();
    tip.style.top = (rect.top - psRect.top - 36) + 'px';
    tip.style.right = '12px';
    tip.style.left = 'auto';
    phoneScreen.style.position = 'relative';
    phoneScreen.appendChild(tip);
    setTimeout(() => tip.remove(), 1800);
}

function populateOverlay() {
    const appMins = getAppMinutes();
    const mins = Math.round(appMins);
    const videoCount = Math.floor(postCount / 2);
    const imageCount = postCount - videoCount;

    // Stats
    if (mins < 1) {
        document.getElementById('statTime').textContent = `${Math.round(appMins * 60)}s`;
    } else if (mins < 60) {
        document.getElementById('statTime').textContent = `${mins}m`;
    } else {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        document.getElementById('statTime').textContent = m > 0 ? `${h}h ${m}m` : `${h}h`;
    }
    document.getElementById('statPosts').textContent = postCount;
    document.getElementById('statVideos').textContent = videoCount;
    document.getElementById('statImages').textContent = imageCount;

    // Opportunity costs
    const costs = getOpportunityCosts(appMins);
    costs.forEach((cost, idx) => {
        const el = document.getElementById(`oppCost${idx + 1}`);
        el.innerHTML = `<span class="opp-icon">${cost.icon}</span><span>${cost.text}</span>`;
    });

    // Reset mood
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
}

function closeApp() {
    document.getElementById('sessionOverlay').classList.remove('visible');
    document.getElementById('dashboardOverlay').classList.remove('visible');
    document.getElementById('closedScreen').classList.add('visible');
}

// ── dashboard ──
function setupDashboard() {
    const dash = document.getElementById('dashboardOverlay');
    const backBtn = document.getElementById('dashboardBack');
    const closeBtn = document.getElementById('dashboardCloseBtn');

    backBtn.addEventListener('click', () => {
        dash.classList.remove('visible');
        document.getElementById('sessionOverlay').classList.add('visible');
    });

    closeBtn.addEventListener('click', closeApp);

    setupGoalEditor();
    setupPartners();
}

function openDashboard() {
    document.getElementById('sessionOverlay').classList.remove('visible');
    const dash = document.getElementById('dashboardOverlay');

    const todayMins = Math.round(getAppMinutes());
    const weekData = [...BASE_WEEKLY_DATA];
    weekData[6] = todayMins;
    renderWeekChart(weekData);

    const totalMins = weekData.reduce((a, b) => a + b, 0);
    document.getElementById('weekTotal').textContent = `Weekly total: ${totalMins} min`;

    updateGoalDisplay(totalMins);
    renderHighlights(todayMins);
    renderDistanceScrolled();
    renderContentBreakdown();
    renderMoodHistory();
    renderPartners();
    dash.classList.add('visible');
}

// ── session highlights ──
function renderHighlights(todayMins) {
    const allMins = [...FAKE_SESSIONS.map(s => s.mins), todayMins];
    const longest = Math.max(...allMins);
    const totalSessions = FAKE_SESSIONS.length + 1;
    const weekTotalMins = [...BASE_WEEKLY_DATA.slice(0, 6), todayMins].reduce((a, b) => a + b, 0);
    const avg = Math.round(weekTotalMins / totalSessions);

    document.getElementById('hlLongest').textContent = longest + 'm';
    document.getElementById('hlSessions').textContent = totalSessions;
    document.getElementById('hlAvg').textContent = avg + 'm';
}

// ── distance scrolled ──
function renderDistanceScrolled() {
    const todayPosts = postCount;
    const weekPosts = FAKE_SESSIONS.reduce((a, s) => a + s.posts, 0) + todayPosts;

    function toDisplay(feet) {
        if (feet >= 5280) {
            const mi = (feet / 5280).toFixed(1);
            return { val: mi, unit: 'mi' };
        }
        return { val: Math.round(feet), unit: 'ft' };
    }

    const todayFeet = Math.round(todayPosts * 9);
    const weekFeet  = Math.round(weekPosts  * 9);

    const td = toDisplay(todayFeet);
    const wd = toDisplay(weekFeet);

    document.getElementById('distTodayVal').textContent  = td.val;
    document.getElementById('distTodayUnit').textContent = td.unit;
    document.getElementById('distWeekVal').textContent   = wd.val;
    document.getElementById('distWeekUnit').textContent  = wd.unit;

    // Progress bar vs. 1 mile reference
    const refFeet = 5280;
    const pct = Math.min(100, Math.round((weekFeet / refFeet) * 100));
    document.getElementById('distBarFill').style.width = pct + '%';
    document.getElementById('distBarRef').textContent = '1 mile';

    // Metaphor line
    let metaphor = '';
    if (weekFeet < 300)       metaphor = 'About the length of a city block this week.';
    else if (weekFeet < 1320) metaphor = `${Math.round(weekFeet / 3)} yards — nearly a quarter mile this week.`;
    else if (weekFeet < 5280) metaphor = `${(weekFeet / 5280).toFixed(2)} miles — a brisk walk's worth of scrolling.`;
    else                      metaphor = `${(weekFeet / 5280).toFixed(1)} miles scrolled — a full run this week! 🏃`;
    document.getElementById('distMetaphor').textContent = metaphor;
}

// ── content breakdown (donut) ──
function renderContentBreakdown() {
    // Combine current session + fake history
    const totalFakePosts = FAKE_SESSIONS.reduce((a, s) => a + s.posts, 0);
    const totalPosts = totalFakePosts + postCount;
    const videos = Math.round(totalPosts / 2);
    const photos = totalPosts - videos;
    const circ = 175.9; // 2π × 28

    document.getElementById('donutTotal').textContent = totalPosts;
    document.getElementById('legendVideos').textContent = videos;
    document.getElementById('legendPhotos').textContent = photos;

    const vPct = totalPosts > 0 ? videos / totalPosts : 0.5;
    const pPct = 1 - vPct;
    const vArc = vPct * circ;
    const pArc = pPct * circ;
    const vDegs = vPct * 360;

    document.getElementById('legendVideosPct').textContent = Math.round(vPct * 100) + '%';
    document.getElementById('legendPhotosPct').textContent = Math.round(pPct * 100) + '%';

    // Avg video watch time (rough estimate: 15 seconds per video at 30x = 0.5 real seconds each)
    const avgWatchSec = 12;
    document.getElementById('legendAvgWatch').textContent = avgWatchSec + 's';

    const dv = document.getElementById('donutVideos');
    const dp = document.getElementById('donutPhotos');

    // Use inline styles so they override CSS rule for stroke-dasharray
    dv.style.strokeDasharray = `${vArc} ${circ}`;
    dv.style.strokeDashoffset = '0';
    dv.setAttribute('transform', 'rotate(-90 40 40)');

    dp.style.strokeDasharray = `${pArc} ${circ}`;
    dp.style.strokeDashoffset = '0';
    dp.setAttribute('transform', `rotate(${-90 + vDegs} 40 40)`);
}

// ── mood history ──
const MOOD_EMOJIS = ['', '😞', '😕', '😐', '🙂', '😄'];

function renderMoodHistory() {
    const container = document.getElementById('moodHistory');
    container.innerHTML = '';

    // Show last 6 fake sessions + today
    const recent = FAKE_SESSIONS.slice(0,6);
    recent.forEach(s => {
        container.appendChild(makeMoodBubble(s.day, s.mins + 'm', s.mood, false));
    });

    // Today (current session)
    const todayMins = Math.round(getAppMinutes());
    container.appendChild(makeMoodBubble('Today', todayMins + 'm', currentMoodRating, true));

    // Trend
    renderMoodTrend(recent, currentMoodRating);
}

function makeMoodBubble(day, duration, mood, isCurrent) {
    const wrap = document.createElement('div');
    wrap.className = 'mood-hist-item';

    const bubble = document.createElement('div');
    if (mood) {
        bubble.className = `mood-hist-bubble mood-${mood}${isCurrent ? ' current' : ''}`;
        bubble.textContent = MOOD_EMOJIS[mood];
    } else {
        bubble.className = `mood-hist-bubble mood-unknown${isCurrent ? ' current' : ''}`;
        bubble.textContent = '?';
    }

    const dayEl = document.createElement('div');
    dayEl.className = 'mood-hist-day';
    dayEl.textContent = day;

    const durEl = document.createElement('div');
    durEl.className = 'mood-hist-dur';
    durEl.textContent = duration;

    wrap.appendChild(bubble);
    wrap.appendChild(dayEl);
    wrap.appendChild(durEl);
    return wrap;
}

function renderMoodTrend(sessions, todayMood) {
    const trendEl = document.getElementById('moodTrendRow');
    trendEl.innerHTML = '';

    const rated = sessions.filter(s => s.mood).map(s => s.mood);
    if (todayMood) rated.push(todayMood);

    if (rated.length < 2) {
        trendEl.innerHTML = '<span class="trend-icon">💬</span><span class="trend-text">Rate your mood after more sessions to see trends.</span>';
        return;
    }

    const half = Math.floor(rated.length / 2);
    const earlyAvg = rated.slice(0, half).reduce((a, b) => a + b, 0) / half;
    const lateAvg  = rated.slice(half).reduce((a, b) => a + b, 0) / (rated.length - half);
    const diff = lateAvg - earlyAvg;

    let icon, text;
    if (diff > 0.4) {
        icon = '📈'; text = 'Your mood after sessions has been improving this week.';
    } else if (diff < -0.4) {
        icon = '📉'; text = 'Your mood after sessions has been dipping — shorter sessions might help.';
    } else {
        icon = '➡️'; text = 'Your mood after sessions has been fairly consistent this week.';
    }

    trendEl.innerHTML = `<span class="trend-icon">${icon}</span><span class="trend-text">${text}</span>`;
}

// ── weekly chart ──
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function renderWeekChart(data) {
    const container = document.getElementById('weekChart');
    container.innerHTML = '';

    const maxVal = Math.max(...data, 1);
    const todayIndex = 6;

    data.forEach((val, i) => {
        const wrap = document.createElement('div');
        wrap.className = 'week-bar-wrap';

        const bar = document.createElement('div');
        bar.className = 'week-bar';
        if (i === todayIndex) bar.classList.add('today');
        if (val > weeklyGoalMinutes / 7) bar.classList.add('over-goal');

        const heightPct = val > 0 ? Math.max(4, Math.round((val / maxVal) * 68)) : 3;
        bar.style.height = heightPct + 'px';

        const label = document.createElement('div');
        label.className = 'week-day-label';
        if (i === todayIndex) label.classList.add('today');
        label.textContent = DAY_LABELS[i];

        wrap.appendChild(bar);
        wrap.appendChild(label);
        container.appendChild(wrap);
    });
}

// ── goal editor ──
function setupGoalEditor() {
    const editBtn = document.getElementById('editGoalBtn');
    const form = document.getElementById('goalEditForm');
    const decBtn = document.getElementById('goalDecBtn');
    const incBtn = document.getElementById('goalIncBtn');
    const valEl = document.getElementById('goalStepVal');
    const saveBtn = document.getElementById('saveGoalBtn');

    let draftGoal = weeklyGoalMinutes;
    valEl.textContent = draftGoal;

    editBtn.addEventListener('click', () => {
        draftGoal = weeklyGoalMinutes;
        valEl.textContent = draftGoal;
        form.classList.add('visible');
    });

    decBtn.addEventListener('click', () => {
        draftGoal = Math.max(15, draftGoal - 15);
        valEl.textContent = draftGoal;
    });

    incBtn.addEventListener('click', () => {
        draftGoal = Math.min(600, draftGoal + 15);
        valEl.textContent = draftGoal;
    });

    saveBtn.addEventListener('click', () => {
        weeklyGoalMinutes = draftGoal;
        form.classList.remove('visible');

        const weekData = [...BASE_WEEKLY_DATA];
        weekData[6] = Math.round(getAppMinutes());
        const totalMins = weekData.reduce((a, b) => a + b, 0);
        document.getElementById('goalTarget').textContent = weeklyGoalMinutes;
        updateGoalDisplay(totalMins);
    });
}

function updateGoalDisplay(usedMins) {
    const pct = Math.min(100, Math.round((usedMins / weeklyGoalMinutes) * 100));
    const circumference = 188.5; // 2π × 30

    document.getElementById('goalPercent').textContent = pct + '%';
    document.getElementById('goalUsedLabel').textContent = usedMins + ' min used';
    document.getElementById('goalTarget').textContent = weeklyGoalMinutes;

    const offset = circumference - (pct / 100) * circumference;
    const ringFill = document.getElementById('ringFill');
    ringFill.style.strokeDashoffset = offset;
    if (pct >= 100) {
        ringFill.classList.add('over-goal');
    } else {
        ringFill.classList.remove('over-goal');
    }
}

// ── accountability partners ──
function setupPartners() {
    const addBtn = document.getElementById('addPartnerBtn');
    const input = document.getElementById('partnerNameInput');

    addBtn.addEventListener('click', () => {
        const name = input.value.trim();
        if (!name) return;
        accountabilityPartners.push(name);
        input.value = '';
        renderPartners();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addBtn.click();
    });
}

function renderPartners() {
    const list = document.getElementById('partnersList');
    list.innerHTML = '';

    if (accountabilityPartners.length === 0) {
        const msg = document.createElement('div');
        msg.className = 'no-partners-msg';
        msg.textContent = 'No partners yet. Add a friend to share\nyour weekly usage summary.';
        list.appendChild(msg);
        return;
    }

    accountabilityPartners.forEach((name, idx) => {
        const row = document.createElement('div');
        row.className = 'partner-row';

        const initial = name.charAt(0).toUpperCase();
        row.innerHTML = `
            <div class="partner-avatar">${initial}</div>
            <div class="partner-name">${name}</div>
            <div class="partner-badge">Weekly digest</div>
            <button class="partner-remove" aria-label="Remove ${name}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>`;

        row.querySelector('.partner-remove').addEventListener('click', () => {
            accountabilityPartners.splice(idx, 1);
            renderPartners();
        });

        list.appendChild(row);
    });
}

// ── reopen (from closed screen) ──
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('reopenBtn').addEventListener('click', () => {
        document.getElementById('closedScreen').classList.remove('visible');
        realSeconds = 0;
        postCount = 0;
        document.getElementById('timerText').textContent = '0:00';
        document.getElementById('feed').innerHTML = '';
        loadPosts();
        startSessionTimer();
    });
});

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

    const isVideo = i % 2 === 1;
    const videoSrc = VIDEOS[Math.floor(i / 2) % VIDEOS.length];
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

    media.addEventListener('click', () => {
        const now = Date.now();
        if (now - lastTap < 300) {
            if (!liked) { liked = true; likeBtn.classList.add('liked'); likesEl.textContent = `${(origLikes + 1).toLocaleString()} likes`; }
            heart.classList.remove('show');
            void heart.offsetWidth;
            heart.classList.add('show');
        }
        lastTap = now;
    });

    if (isVideo) {
        const video = el.querySelector('video');
        const muteBtn = el.querySelector('.video-mute');
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => e.isIntersecting ? video.play().catch(() => {}) : video.pause());
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
