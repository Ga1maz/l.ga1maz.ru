const CACHE_NAME = "app-cache-v1";
const urlsToCache = [
  "/index.html",
  "/BSansDisplay-SemiBold.woff2",
  "/SBSansText-Medium.woff2",
  "/background.webm",
  "/SBSansText-Regular.woff2",
  "/SBSansText-SemiBold.woff2",
  "/qr-code.jpg",
  "/manifest.json",
  "/icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
