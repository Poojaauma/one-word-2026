// One Word · 2026 Service Worker
const CACHE_NAME = 'one-word-2026-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/icon-192.png',
    '/icon-512.png'
];

// Fallback affirmations when API is unavailable
const FALLBACK_AFFIRMATIONS = [
    "Today is full of possibilities.",
    "You are exactly where you need to be.",
    "Small steps lead to great journeys.",
    "Your potential is limitless.",
    "Peace begins with a single breath.",
    "You have the strength to handle this.",
    "Every moment is a fresh beginning.",
    "Trust the process of your growth.",
    "You are worthy of good things.",
    "Let go of what no longer serves you."
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached response if available
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Otherwise fetch from network
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache non-successful responses or external resources
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone and cache the response
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Return offline page for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match('/');
                        }
                        return new Response('Offline', { status: 503 });
                    });
            })
    );
});

// Fetch affirmation from API
async function fetchAffirmation() {
    try {
        const response = await fetch('https://www.affirmations.dev/');
        if (!response.ok) throw new Error('API failed');
        const data = await response.json();
        return data.affirmation;
    } catch (error) {
        // Return random fallback affirmation
        const randomIndex = Math.floor(Math.random() * FALLBACK_AFFIRMATIONS.length);
        return FALLBACK_AFFIRMATIONS[randomIndex];
    }
}

// Get contextual line based on user's word
function getContextualLine(word) {
    if (!word) return '';

    const lines = [
        `Let ${word.toLowerCase()} guide you today.`,
        `Embrace ${word.toLowerCase()} in this moment.`,
        `Remember your word: ${word}.`,
        `${word} is your compass today.`,
        `Carry ${word.toLowerCase()} with you.`
    ];

    const randomIndex = Math.floor(Math.random() * lines.length);
    return lines[randomIndex];
}

// Show notification
async function showNotification(word) {
    const affirmation = await fetchAffirmation();
    const contextLine = word ? `\n${getContextualLine(word)}` : '';

    // Occasional subtle emoji
    const emojis = ['🌱', '✨', '🌸', '💫', '🌿', ''];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    const title = 'One Word · 2026';
    const body = `${affirmation}${contextLine} ${emoji}`.trim();

    return self.registration.showNotification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'daily-affirmation',
        renotify: true,
        silent: false,
        vibrate: [100, 50, 100],
        data: {
            affirmation,
            word,
            timestamp: Date.now()
        }
    });
}

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Focus existing window if available
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Otherwise open new window
                return clients.openWindow('/');
            })
    );
});

// Listen for messages from the app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        showNotification(event.data.word);
    }

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Periodic sync for daily notifications (if supported)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'daily-affirmation') {
        event.waitUntil(
            // Get user's word from IndexedDB or use message passing
            showNotification('')
        );
    }
});
