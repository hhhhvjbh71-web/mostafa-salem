// ============================================================
// Never Give Up English Platform — Service Worker
// Mr. Mostafa Salem
// ============================================================

const CACHE_VERSION = 'never-give-up-shell-v7';
const OFFLINE_URL = 'offline.html';

const SHELL_ASSETS = [
  './',
  'index.html',
  'login.html',
  'register.html',
  'profile.html',
  'lessons.html',
  'manifest.json',
  'offline.html',
  'i18n.js',
  'grade-mapping.js',
  'session-guard.js',
  'icons/icon-72.png',
  'icons/icon-96.png',
  'icons/icon-128.png',
  'icons/icon-144.png',
  'icons/icon-152.png',
  'icons/icon-192.png',
  'icons/icon-384.png',
  'icons/icon-512.png'
];

// NOTE: dashboard.html is intentionally NOT pre-cached in the shell list.
// It's admin-only and gated by a password screen; we still let it be
// cached opportunistically on first visit (see fetch handler) but we
// don't want it silently bundled into the public install step.

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(SHELL_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Never touch Firebase / Google API / third-party calls — those must
// always go straight to the network so live data stays live.
function isThirdParty(url) {
  return (
    url.origin !== self.location.origin ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('gstatic.com') ||
    url.hostname.includes('cloudflare.com') ||
    url.hostname.includes('unpkg.com')
  );
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Page navigations: network-first, fall back to cache, then offline page.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  // Third-party / Firebase requests: always go to network untouched.
  if (isThirdParty(url)) return;

  // A stale Firebase configuration can point a browser at a different project
  // and make all live collections look empty. Always fetch it from the network.
  if (url.pathname.endsWith('/firebase-config.js')) {
    event.respondWith(fetch(req));
    return;
  }

  // Same-origin static assets (icons, manifest, local scripts): cache-first.
  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy)).catch(() => {});
            return res;
          })
          .catch(() => cached)
    )
  );
});
