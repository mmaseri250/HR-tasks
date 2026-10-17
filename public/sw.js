// Service Worker for Jawharat Al-Majd HRMS PWA (Version 2026-v4)
const CACHE_NAME = 'jawharat-hrms-v2026-v4';
const ASSETS_TO_PRECACHE = [
  './manifest.json',
  './assets/logo.png',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

// Install Event - cache essential static assets & activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_PRECACHE).catch((err) => console.warn('Precache partial warning:', err));
    })
  );
});

// Activate Event - aggressively wipe out any older caches (v1, v2, v3, etc.) and claim all clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('✓ Purging outdated HRMS service worker cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Network First for HTML/JS/CSS to ensure users ALWAYS get live, fresh data
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. API Calls: ALWAYS Network Only (Never serve stale cached data for HR/Compliance/Attendance)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ offline: true, success: false, message: 'الوضع غير متصل بالإنترنت' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // 2. Navigation & Application Code (HTML, JS, CSS): NETWORK FIRST
  // Guarantees zero stale UI while still providing robust offline capability
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname === '/') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback to cache if network is unavailable (offline mobile / desktop)
          return caches.match(event.request).then((cached) => {
            if (cached) return cached;
            if (event.request.mode === 'navigate') return caches.match('./index.html');
            return new Response('', { status: 408 });
          });
        })
    );
    return;
  }

  // 3. Static Media (Images, Fonts, Icons): Stale While Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
        }
        return networkResponse;
      }).catch(() => null);

      return cachedResponse || fetchPromise;
    })
  );
});
