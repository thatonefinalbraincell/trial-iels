import { clearSession } from '~/server/utils/auth'
export default defineEventHandler((event) => { clearSession(event); return { ok: true } })
