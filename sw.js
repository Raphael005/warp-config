const CACHE_NAME = 'my-pwa-v1';

// Assets to pre-cache on install (cache-first strategy)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add your CSS/JS bundles here:
  // '/styles.css',
  // '/app.js',
];

// ─── Install ──────────────────────────────────────────────────────────────────
// Pre-cache static assets and activate immediately.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting(); // Activate new SW without waiting for old one to finish
});

// ─── Activate ─────────────────────────────────────────────────────────────────
// Remove outdated caches from previous SW versions.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim(); // Take control of all open tabs immediately
});

// ─── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) return;

  // Strategy: Network-first for HTML (always get fresh pages)
  if (request.destination === 'document') {
    event.respondWith(networkFirst(request));
    return;
  }

  // Strategy: Cache-first for static assets (JS, CSS, images, fonts)
  if (['script', 'style', 'image', 'font'].includes(request.destination)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Default: Network-first for everything else (API calls, etc.)
  event.respondWith(networkFirst(request));
});

// ─── Strategies ───────────────────────────────────────────────────────────────

/**
 * Cache-first: serve from cache, fall back to network and update cache.
 * Best for: static assets (JS, CSS, images) that change infrequently.
 */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
  }
  return response;
}

/**
 * Network-first: try network, fall back to cache if offline.
 * Best for: HTML pages and API calls that need fresh data.
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response('Offline – content not available', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
