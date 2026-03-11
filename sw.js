const CACHE = "tasks-v4";
const STATIC = [
  "https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const url = e.request.url;
  // Always fetch HTML fresh from network
  if (url.includes("imsidj3000.github.io") || url.includes("api.github.com")) return;
  // Cache only external static libs
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
