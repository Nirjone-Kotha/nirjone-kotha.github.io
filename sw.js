const VERSION = "6.3.0";
const SHELL_CACHE = `moner-kotha-shell-${VERSION}`;
const RUNTIME_CACHE = `moner-kotha-runtime-${VERSION}`;
const APP_SHELL = [
  "./", "./index.html", "./offline.html", "./manifest.webmanifest",
  "./assets/css/styles.css?v=6.3.0", "./assets/js/app.js?v=6.3.0", "./assets/js/data.js?v=6.3.0",
  "./assets/js/storage.js?v=6.3.0", "./assets/js/ads.js?v=6.3.0", "./assets/js/platform.js?v=6.3.0", "./assets/js/pwa.js?v=6.3.0", "./assets/js/safety.js?v=6.3.0",
  "./assets/js/config.js?v=6.3.0", "./assets/js/consent.js?v=6.3.0", "./assets/js/analytics.js?v=6.3.0", "./assets/js/public.js?v=6.3.0", "./assets/js/islamic.js?v=6.3.0", "./assets/js/video_catalog.js?v=6.3.0", "./assets/js/youtube_player.js?v=6.3.0",
  "./assets/js/firebase-core.js?v=6.3.0", "./assets/js/user-identity.js?v=6.3.0", "./admin/public/runtime-client.js?v=6.3.0",
  "./assets/css/admin_runtime.css?v=6.3.0", "./assets/css/public.css?v=6.3.0", "./config/site.json", "./config/firebase-config.js", "./config/firebase-defaults.js",
  "./assets/icons/favicon.png", "./assets/brand/logo-mark.png", "./assets/brand/share-cover.png", "./assets/icons/icon-192.png", "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-512.png", "./assets/icons/apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil((async()=>{await (await caches.open(SHELL_CACHE)).addAll(APP_SHELL);await self.skipWaiting();})());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => ![SHELL_CACHE, RUNTIME_CACHE].includes(key)).map(key => caches.delete(key)));
    if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
    await self.clients.claim();
  })());
});

self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const preload = await event.preloadResponse;
        if (preload) return preload;
        const response = await fetch(request);
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, response.clone());
        return response;
      } catch {
        return (await caches.match(request)) || (await caches.match("./index.html")) || caches.match("./offline.html");
      }
    })());
    return;
  }

  if (["style", "script"].includes(request.destination)) {
    event.respondWith((async () => {
      try {
        const response = await fetch(request, { cache: "no-store" });
        if (response.ok) (await caches.open(RUNTIME_CACHE)).put(request, response.clone());
        return response;
      } catch {
        return (await caches.match(request)) || Response.error();
      }
    })());
    return;
  }

  if (["image", "font"].includes(request.destination)) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      const network = fetch(request).then(async response => {
        if (response.ok) (await caches.open(RUNTIME_CACHE)).put(request, response.clone());
        return response;
      }).catch(() => null);
      return cached || (await network) || Response.error();
    })());
  }
});

self.addEventListener("push", event => {
  let payload = {};
  try { payload = event.data?.json?.() || { body: event.data?.text?.() || "" }; } catch { payload = { body: event.data?.text?.() || "" }; }
  const title = payload.title || "Moner Kotha";
  const options = {
    body: payload.body || "You have a new supportive update.",
    icon: "./assets/icons/icon-192.png",
    badge: "./assets/icons/favicon.png",
    tag: payload.tag || "moner-kotha-update",
    data: { url: payload.url || "./?view=home" },
    renotify: Boolean(payload.renotify)
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "./?view=home", self.registration.scope).href;
  event.waitUntil((async () => {
    const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of clients) {
      if ("focus" in client) {
        await client.navigate?.(target);
        return client.focus();
      }
    }
    return self.clients.openWindow?.(target);
  })());
});
