const CACHE_NAME = 'short-url-v3-cache';
const urlsToCache = [
  '/login',
  '/logo.png',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  // Hanya tangani request GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Jika request berhasil, kembalikan response jaringan
        return response;
      })
      .catch(() => {
        // Jika offline, coba ambil dari cache
        return caches.match(event.request);
      })
  );
});
