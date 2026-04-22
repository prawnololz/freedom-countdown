const CACHE_NAME = 'freedom-v2';
const BASE = '/freedom-countdown';
const ASSETS = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/manifest.json',
  BASE + '/icon-192.png',
  BASE + '/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request)));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(BASE + '/'));
});

async function showDailyNotification() {
  const diff = new Date('2026-05-08T15:00:00') - new Date();
  if (diff <= 0) return;
  const days = Math.floor(diff / 864e5);
  const msgs = [
    `${days} days to freedom! The exit shaft is getting closer! ⛏️🎉`,
    `Just ${days} days left! Almost through the rock face! 💎`,
    `${days} more days in the mine. Freedom is RIGHT there! 🚀`,
    `T-minus ${days} days! Start planning that victory lap! 🏁`,
  ];
  return self.registration.showNotification('⛏️ Freedom Countdown!', {
    body: msgs[Math.floor(Math.random() * msgs.length)],
    icon: BASE + '/icon-192.png',
    tag: 'freedom-daily',
    renotify: true,
    vibrate: [200, 100, 200],
  });
}
