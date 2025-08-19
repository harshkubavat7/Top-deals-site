// service-worker.js

// Import OneSignal SDK
importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');

// Custom caching for PWA
const CACHE_NAME = "deals-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/deals.json",
  "/manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
