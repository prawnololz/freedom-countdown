const CACHE_NAME = 'freedom-v1';
const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});

// Daily notification scheduling via periodic sync (fires when browser allows)
self.addEventListener('periodicsync', e => {
  if (e.tag === 'daily-freedom') {
    e.waitUntil(showDailyNotification());
  }
});

async function showDailyNotification() {
  const target = new Date('2026-05-08T17:00:00');
  const now = new Date();
  const diff = target - now;
  if (diff <= 0) return;
  const days = Math.floor(diff / 864e5);
  const msgs = [
    `${days} days to freedom! The exit shaft is getting closer! ⛏️🎉`,
    `Just ${days} days left! You're almost through the rock face! 💎`,
    `${days} more days in the mine. Freedom is RIGHT there! 🚀`,
    `T-minus ${days} days! Start planning that victory lap! 🏁`,
  ];
  const body = msgs[Math.floor(Math.random() * msgs.length)];
  return self.registration.showNotification('⛏️ Freedom Countdown!', {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'freedom-daily',
    renotify: true,
    vibrate: [200, 100, 200],
  });
}
