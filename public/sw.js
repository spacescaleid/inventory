/* Service Worker untuk Inventory Seragam PWA */

const CACHE_NAME = "inventory-v1";
const OFFLINE_URL = "/offline";

// Files yang di-cache saat install
const STATIC_ASSETS = [
  "/",
  "/beranda",
  "/stok",
  "/catat",
  "/riwayat",
  "/lainnya",
  "/offline",
  "/manifest.json",
  "/favicon.png",
  "/apple-touch-icon.png",
];

// Install event — cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Caching static assets");
        // Cache satu-satu supaya kalau ada yang gagal, yang lain tetap masuk
        return Promise.allSettled(
          STATIC_ASSETS.map((url) =>
            cache.add(url).catch((err) => {
              console.warn(`[SW] Failed to cache ${url}:`, err);
            })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event — clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log("[SW] Removing old cache:", name);
              return caches.delete(name);
            })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch event — network first, fallback to cache
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip chrome extensions
  if (!request.url.startsWith("http")) return;

  // Skip PocketBase API calls (biarkan network handle)
  if (request.url.includes("/api/") || request.url.includes("/pb/")) return;

  // Navigation requests (halaman HTML)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful navigation
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline — coba dari cache, atau fallback ke offline page
          return caches.match(request).then((cached) => {
            return cached || caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // Static assets (JS, CSS, images) — cache first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          if (!response.ok) return response;

          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));

          return response;
        })
        .catch(() => {
          // Return empty response untuk asset yang tidak bisa di-load
          return new Response("", { status: 408 });
        });
    })
  );
});

// Message event — untuk update SW
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});