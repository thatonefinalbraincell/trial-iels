// Self-unregistering service worker.
// A previous build (or browser extension) may have registered a service worker on
// this origin. That SW was intercepting /admin/audio and rejecting the fetch promise,
// which showed up as "Failed to convert value to 'Response'". This stub unregisters
// itself and clears all caches so future requests go straight to the network.

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys()
      await Promise.all(keys.map((k) => caches.delete(k)))
    } catch (e) { /* ignore */ }
    try {
      await self.registration.unregister()
    } catch (e) { /* ignore */ }
    const clientsList = await self.clients.matchAll({ type: 'window' })
    clientsList.forEach((c) => c.navigate(c.url))
  })())
})

// Never intercept fetches — let the network handle everything.
self.addEventListener('fetch', () => {})
