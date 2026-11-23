/* Service worker: menyimpan kerangka aplikasi supaya terbuka tanpa internet. Naikkan VERSION saat berkas aplikasi diganti. */
var VERSION = 'tito-v1', SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  var r = e.request; if (r.method !== 'GET') return;
  var same = new URL(r.url).origin === location.origin;
  e.respondWith(fetch(r).then(function (res) { if (res && res.ok && (same || /fonts\.(googleapis|gstatic)\.com/.test(r.url))) { var cp = res.clone(); caches.open(VERSION).then(function (c) { c.put(r, cp); }); } return res; })
    .catch(function () { return caches.match(r).then(function (m) { return m || (r.mode === 'navigate' ? caches.match('index.html') : undefined); }); }));
});
