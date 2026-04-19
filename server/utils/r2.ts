// R2 storage helper.
//
// Cloudflare Pages injects the R2 bucket as a binding named `UPLOADS` (see
// wrangler.toml). In local `wrangler pages dev` the same binding is backed by
// a real R2 bucket (or a local emulator if you pass --r2=UPLOADS).
//
// The public URL prefix comes from runtime config (r2PublicUrl).

import type { H3Event } from 'h3'

interface R2PutOptions {
  httpMetadata?: { contentType?: string; contentDisposition?: string; cacheControl?: string }
  customMetadata?: Record<string, string>
}
interface R2Bucket {
  put: (key: string, value: ArrayBuffer | ReadableStream | Uint8Array, opts?: R2PutOptions) => Promise<any>
  delete: (key: string) => Promise<void>
  head: (key: string) => Promise<any>
  get: (key: string) => Promise<any>
}

const MISSING_R2 =
  'R2 binding "UPLOADS" is not attached. ' +
  'Run the server via `npx wrangler pages dev .output/public` (or deploy to Cloudflare Pages). ' +
  'Plain `nuxt dev` does not have bindings.'

export function useR2(event?: H3Event): R2Bucket {
  const fromEvent =
    (event as any)?.context?.cloudflare?.env?.UPLOADS ||
    (event as any)?.context?.cf?.env?.UPLOADS
  if (fromEvent) return fromEvent as R2Bucket
  const fromGlobal = (globalThis as any).UPLOADS || (globalThis as any).__env__?.UPLOADS
  if (fromGlobal) return fromGlobal as R2Bucket
  throw createError({ statusCode: 503, statusMessage: MISSING_R2, data: { code: 'R2_NO_BINDING' } })
}

/** Public URL prefix, e.g. https://pub-xxxxx.r2.dev */
export function r2PublicUrl(): string {
  const cfg = useRuntimeConfig()
  return String(cfg.r2PublicUrl || '').replace(/\/+$/, '')
}

/** Build the full public URL for an R2 object key. */
export function r2UrlFor(key: string): string {
  return `${r2PublicUrl()}/${key.replace(/^\/+/, '')}`
}
