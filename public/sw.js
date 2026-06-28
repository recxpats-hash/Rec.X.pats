// Progressive Web App Service Worker
const CACHE_NAME = "recxpats-os-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json"
];

// Install Service Worker
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching files");
      return cache.addAll(ASSETS).catch((err) => {
        console.warn("[Service Worker] Initial caching bypassed: ", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Clearing stale cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch standard cache-first or network-first interception strategy
self.addEventListener("fetch", (e) => {
  // Let the browser handle standard non-GET requests natively
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).then((networkResponse) => {
        // Return resource or update temporary core cache on-the-fly
        return networkResponse;
      }).catch(() => {
        // Fallback or skip if network fails
        return caches.match("/");
      });
    })
  );
});
