// Proactively unregister any leftover service workers and clear their caches.
// An older build (or a browser extension) may have registered a service worker
// on this origin that intercepts /admin/audio requests and rejects them with
// "Failed to convert value to 'Response'". This plugin runs once on the client
// and cleans up every SW + cache it can find, so future requests go straight
// to the network.
export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return
  if (!('serviceWorker' in navigator)) return

  // Run async, but don't block app startup.
  queueMicrotask(async () => {
    try {
      const regs = await navigator.serviceWorker.getRegistrations()
      if (regs.length) {
        // eslint-disable-next-line no-console
        console.info(`[sw] unregistering ${regs.length} stale service worker(s)`)
        await Promise.all(regs.map(r => r.unregister().catch(() => {})))
      }
    } catch { /* ignore */ }
    try {
      if ('caches' in window) {
        const keys = await caches.keys()
        if (keys.length) {
          // eslint-disable-next-line no-console
          console.info(`[sw] clearing ${keys.length} stale cache(s)`)
          await Promise.all(keys.map(k => caches.delete(k).catch(() => false)))
        }
      }
    } catch { /* ignore */ }
  })
})
