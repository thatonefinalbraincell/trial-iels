import type { H3Event } from 'h3'

// Type declarations for Cloudflare D1 (to fix TypeScript errors)
interface D1Database {
  prepare(sql: string): D1PreparedStatement
  batch<T = any>(statements: D1PreparedStatement[]): Promise<T[]>
  dump(): Promise<ArrayBuffer>
  exec(sql: string): Promise<D1Result>
}

interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement
  first<T = any>(column?: string): Promise<T | null>
  run(): Promise<D1Result>
  all<T = any>(): Promise<D1Result<T>>
  raw<T = any>(): Promise<T[]>
}

interface D1Result<T = any> {
  success: boolean
  meta?: any
  results?: T[]
  lastInsertRowid?: number | null
  changes?: number
  duration?: number
  served_by?: string
}

export interface AppDb {
  /** First row or null. */
  first<T = any>(sql: string, ...args: any[]): Promise<T | null>
  /** All matching rows. */
  all<T = any>(sql: string, ...args: any[]): Promise<T[]>
  /** INSERT/UPDATE/DELETE with metadata. */
  run(sql: string, ...args: any[]): Promise<{ lastInsertRowid: number; changes: number }>
  /** Prepare a statement for batch execution. */
  prepare(sql: string, ...args: any[]): any
  /** Execute statements in a batch transaction. */
  batch(stmts: any[]): Promise<any[]>
}

function useDb(event: H3Event): AppDb {
  // Cast to our D1Database type to fix TypeScript errors
  const db = event.context.cloudflare?.env?.ielts_db as unknown as D1Database
  if (!db) {
    throw new Error('D1 database binding not found (ielts_db)')
  }

  return {
    async first<T = any>(sql: string, ...args: any[]): Promise<T | null> {
      const result = await db.prepare(sql).bind(...args).first<T>()
      return result || null
    },

    async all<T = any>(sql: string, ...args: any[]): Promise<T[]> {
      const { results } = await db.prepare(sql).bind(...args).all<T>()
      return results || []
    },

    async run(sql: string, ...args: any[]): Promise<{ lastInsertRowid: number; changes: number }> {
      const meta = await db.prepare(sql).bind(...args).run()
      return {
        lastInsertRowid: Number(meta.lastInsertRowid ?? 0),
        changes: meta.changes ?? 0
      }
    },

    prepare(sql: string, ...args: any[]) {
      const stmt = db.prepare(sql).bind(...args)
      return {
        async run() {
          const meta = await stmt.run()
          return {
            lastInsertRowid: Number(meta.lastInsertRowid ?? 0),
            changes: meta.changes ?? 0
          }
        },
        async all() {
          const { results } = await stmt.all()
          return results || []
        },
        async get() {
          return await stmt.first()
        }
      }
    },

    async batch(stmts: any[]): Promise<any[]> {
      const d1Stmts = stmts.map((s) => {
        // If it's already a prepared statement (has _statement), use it
        if (s._statement) {
          return s as unknown as D1PreparedStatement
        }
        // Otherwise, assume it's { sql, args } or similar and create statement
        return s
      })
      return await db.batch(d1Stmts)
    }
  }
}

export { useDb }
