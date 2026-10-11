/* Static shell cache for PLAN. Live CDN charts/fonts require internet. */
const CACHE_NAME = "plan-shell-v1";
const CORE_FILES = [
  "",
  "index.html",
  "assets/css/app.css",
  "assets/js/app.js",
  "data/plans.js",
  "assets/favicon.svg",
  "manifest.webmanifest"
];
const shellUrl = path => new URL(path, self.registration.scope).href;

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_FILES.map(shellUrl)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith("plan-shell-") && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(request);
      if (response && response.ok) await cache.put(request, response.clone());
      return response;
    } catch (_) {
      const cached = await cache.match(request);
      if (cached) return cached;
      if (request.mode === "navigate") {
        const index = await cache.match(shellUrl("index.html"));
        if (index) return index;
      }
      return new Response("PLAN is offline. Reconnect and reload to refresh market data.", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
  })());
});
