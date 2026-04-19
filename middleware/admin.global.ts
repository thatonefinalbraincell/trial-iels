// Global route middleware: protect /admin/* except /admin/login
// On SSR, forward the incoming Cookie header so session is preserved on first paint.
export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) return
  if (to.path === '/admin/login') return

  const headers: Record<string, string> = {}
  if (import.meta.server) {
    const evt = useRequestEvent()
    const cookie = evt?.node?.req?.headers?.cookie
    if (cookie) headers.cookie = cookie
  }

  try {
    const me: any = await $fetch('/api/auth/me', { headers })
    if (me?.user?.role === 'admin') return
  } catch {}

  // Fallback: probe an admin endpoint — succeeds for pure admin sessions (no user row)
  try {
    await $fetch('/api/admin/tests', { headers })
    return
  } catch {
    return navigateTo('/admin/login')
  }
})
