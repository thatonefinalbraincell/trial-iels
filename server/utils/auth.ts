import bcrypt from 'bcryptjs'
import { createHmac, randomBytes } from 'node:crypto'
import type { H3Event } from 'h3'
// Note: getCookie/setCookie/deleteCookie are globally auto-imported by Nitro,
// so we don't re-import them here (avoids "Duplicated imports" warning).

const COOKIE = 'ielts_sess'

// Simple HMAC-signed token: base64(payload).base64(sig)
function sign(payload: Record<string, any>, secret: string) {
  const p = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = createHmac('sha256', secret).update(p).digest('base64url')
  return `${p}.${sig}`
}
function verify(token: string, secret: string): any | null {
  if (!token || !token.includes('.')) return null
  const [p, sig] = token.split('.')
  const expected = createHmac('sha256', secret).update(p).digest('base64url')
  if (expected !== sig) return null
  try { return JSON.parse(Buffer.from(p, 'base64url').toString('utf8')) } catch { return null }
}

export async function hashPassword(pw: string) { return bcrypt.hash(pw, 10) }
export async function checkPassword(pw: string, hash: string) { return bcrypt.compare(pw, hash) }

export function issueSession(event: H3Event, user: { id: number | string; role: string; email?: string }) {
  const cfg = useRuntimeConfig()
  const token = sign({ uid: user.id, role: user.role, email: user.email, iat: Date.now() }, cfg.jwtSecret as string)
  setCookie(event, COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  })
}

export function clearSession(event: H3Event) { deleteCookie(event, COOKIE, { path: '/' }) }

export function currentUser(event: H3Event): { uid: number | string; role: string; email?: string } | null {
  const cfg = useRuntimeConfig()
  const tok = getCookie(event, COOKIE)
  if (!tok) return null
  return verify(tok, cfg.jwtSecret as string)
}

export function requireAdmin(event: H3Event) {
  const u = currentUser(event)
  if (!u || u.role !== 'admin') {
    throw createError({ statusCode: 401, statusMessage: 'Admin authentication required' })
  }
  return u
}

export function randomToken() { return randomBytes(16).toString('hex') }
