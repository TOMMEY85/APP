const CACHE_NAME = 'carpzone-nature-v8-nested';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './css/phone-frame.css',
  './css/screens.css',
  './css/components.css',
  './css/animations.css',
  './css/fishing-theme.css?v=8',
  './assets/lake-landscape.svg',
  './data/app-data.js',
  './js/weather.js',
  './js/profile-manager.js',
  './js/map-manager.js',
  './js/auth-cloud.js',
  './js/ui-generator.js',
  './js/modals.js',
  './js/navigation.js',
  './js/app.js',
  './assets/icons/icon-180.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Same-origin app files: network first so Netlify updates appear immediately,
  // with cache fallback when the device is offline.
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // External resources such as Font Awesome: network first with graceful fallback.
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
