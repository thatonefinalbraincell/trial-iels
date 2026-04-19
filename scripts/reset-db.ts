// One-shot reset: wipes the SQLite DB (including WAL/SHM) and re-seeds.
// Use this when you see "SQLITE_CORRUPT" / "database disk image is malformed".
//
//   npm run reset-db
//
import { existsSync, rmSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { spawnSync } from 'node:child_process'

const dbPath = resolve(process.cwd(), process.env.DB_PATH || './data/ielts.sqlite')
const dir = dirname(dbPath)

if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

const candidates = [dbPath, `${dbPath}-wal`, `${dbPath}-shm`, `${dbPath}-journal`]
let removed = 0
for (const p of candidates) {
  if (existsSync(p)) {
    try {
      rmSync(p, { force: true })
      console.log(`[reset-db] removed ${p}`)
      removed++
    } catch (e) {
      console.error(`[reset-db] FAILED to remove ${p} — is the dev server still running? Stop it (Ctrl-C) and try again.`)
      console.error(e)
      process.exit(1)
    }
  }
}
if (!removed) console.log('[reset-db] no existing DB files to remove.')

console.log('[reset-db] running seed…')
const seed = spawnSync(process.execPath, ['--experimental-strip-types', 'scripts/seed.ts'], {
  stdio: 'inherit',
  env: process.env
})
if (seed.status !== 0) {
  console.error('[reset-db] seed failed.')
  process.exit(seed.status || 1)
}
console.log('[reset-db] done — fresh DB ready.')
