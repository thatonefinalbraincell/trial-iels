// D1-backed database helper.
//
// At runtime on Cloudflare Pages, the D1 database is injected as a binding named
// `ielts_db` via the event's Cloudflare env (configured in wrangler.toml).
// During `wrangler pages dev` the same binding is provided by a local SQLite
// emulator, so the same code works in both.
//
// Usage in an event handler:
//
//   const db = useDb(event)
//   const tests = await db.all<{ id: number; title: string }>(
//     'SELECT id, title FROM tests ORDER BY id'
//   )
//   const test = await db.first('SELECT * FROM tests WHERE id = ?', id)
//   const info = await db.run(
//     'INSERT INTO tests (title, skill) VALUES (?, ?)',
//     title, skill
//   )
//   console.log(info.lastInsertRowid, info.changes)
//
// The helper keeps a similar surface to the old better-sqlite3 code (`first`,
// `all`, `run`) so handlers port with minimal edits — the main difference is
// every call is now `await`.

import type { H3Event } from 'h3'

// D1Database types come from @cloudflare/workers-types. If the package isn't
// installed yet (local TypeScript) we fall back to `any`-ish shapes so the
// code still builds — the real types take over once @cloudflare/workers-types
// is present.
type D1Row = Record<string, any>
interface D1RunMeta { last_row_id?: number; changes?: number; duration?: number }
interface D1PreparedStatement {
  bind: (...values: any[]) => D1PreparedStatement
  first: <T = D1Row>() => Promise<T | null>
  all: <T = D1Row>() => Promise<{ results: T[]; success: boolean; meta: D1RunMeta }>
  run: () => Promise<{ success: boolean; meta: D1RunMeta }>
}
interface D1Database {
  prepare: (sql: string) => D1PreparedStatement
  batch: (stmts: D1PreparedStatement[]) => Promise<Array<{ results: any[]; success: boolean; meta: D1RunMeta }>>
  exec: (sql: string) => Promise<{ count: number; duration: number }>
}

export interface AppDb {
  /** First row or null. */
  first<T = D1Row>(sql: string, ...args: any[]): Promise<T | null>
  /** All matching rows. */
  all<T = D1Row>(sql: string, ...args: any[]): Promise<T[]>
  /** INSERT/UPDATE/DELETE with metadata. */
  run(sql: string, ...args: any[]): Promise<{ lastInsertRowid: number; changes: number }>
  /** Build a prepared statement (used for `batch`). */
  prepare(sql: string, ...args: any[]): D1PreparedStatement
  /** Run a list of prepared statements atomically. */
  batch<T = D1Row>(stmts: D1PreparedStatement[]): Promise<Array<{ results: T[]; lastInsertRowid: number; changes: number }>>
  /** Raw D1 handle, for advanced use. */
  raw: D1Database
}

const MISSING_D1 =
  'D1 binding "ielts_db" is not attached. ' +
  'Run the server via `npx wrangler pages dev .output/public` (or deploy to Cloudflare Pages) — ' +
  'plain `npm run dev` does not have Cloudflare bindings.'

function resolveD1(event: H3Event | undefined): D1Database {
  // Cloudflare Pages injects bindings at event.context.cloudflare.env
  const fromEvent =
    (event as any)?.context?.cloudflare?.env?.ielts_db ||
    (event as any)?.context?.cf?.env?.ielts_db
  if (fromEvent) return fromEvent as D1Database

  // Fallback: some dev adapters expose bindings on globalThis.
  const fromGlobal = (globalThis as any).ielts_db || (globalThis as any).__env__?.ielts_db
  if (fromGlobal) return fromGlobal as D1Database

  throw createError({ statusCode: 503, statusMessage: MISSING_D1, data: { code: 'D1_NO_BINDING' } })
}

/**
 * Returns the D1-backed database helper. Each handler should call this once
 * per request; it's cheap — just grabs the binding off the event.
 */
export function useDb(event?: H3Event): AppDb {
  const raw = resolveD1(event)

  function prep(sql: string, args: any[]): D1PreparedStatement {
    const stmt = raw.prepare(sql)
    return args.length ? stmt.bind(...args) : stmt
  }

  return {
    raw,
    prepare: (sql, ...args) => prep(sql, args),
    async first<T = D1Row>(sql: string, ...args: any[]) {
      try {
        return (await prep(sql, args).first<T>()) ?? null
      } catch (e: any) {
        throw mapDbError(e)
      }
    },
    async all<T = D1Row>(sql: string, ...args: any[]) {
      try {
        const res = await prep(sql, args).all<T>()
        return (res.results ?? []) as T[]
      } catch (e: any) {
        throw mapDbError(e)
      }
    },
    async run(sql: string, ...args: any[]) {
      try {
        const res = await prep(sql, args).run()
        return {
          lastInsertRowid: Number(res.meta?.last_row_id ?? 0),
          changes: Number(res.meta?.changes ?? 0)
        }
      } catch (e: any) {
        throw mapDbError(e)
      }
    },
    async batch<T = D1Row>(stmts: D1PreparedStatement[]) {
      try {
        const res = await raw.batch(stmts)
        return res.map((r) => ({
          results: (r.results ?? []) as T[],
          lastInsertRowid: Number(r.meta?.last_row_id ?? 0),
          changes: Number(r.meta?.changes ?? 0)
        }))
      } catch (e: any) {
        throw mapDbError(e)
      }
    }
  }
}

/**
 * Normalise D1 errors into h3-style errors so the client sees something useful
 * instead of a bare 500. D1 throws plain Error for constraint violations, etc.
 */
function mapDbError(e: any) {
  const msg = String(e?.message || e)
  if (/UNIQUE constraint/i.test(msg)) {
    return createError({ statusCode: 409, statusMessage: 'Unique constraint violation', data: { code: 'UNIQUE', detail: msg } })
  }
  if (/FOREIGN KEY/i.test(msg)) {
    return createError({ statusCode: 409, statusMessage: 'Foreign key violation', data: { code: 'FK', detail: msg } })
  }
  if (/no such table|no such column/i.test(msg)) {
    return createError({ statusCode: 503, statusMessage: 'Database schema not initialised — run `npm run db:schema`', data: { code: 'NO_SCHEMA', detail: msg } })
  }
  return createError({ statusCode: 500, statusMessage: 'Database error', data: { detail: msg } })
}
