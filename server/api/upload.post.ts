import { useR2, r2UrlFor } from '~/server/utils/r2'
import { readMultipartFormData } from 'h3'

// Public upload endpoint used by the Speaking recorder for student audio.
// Accepts multipart/form-data with a "file" part. Files land in R2 under
// `responses/<file>` and are served via pub-*.r2.dev.
export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event)
  if (!parts) throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
  const file = parts.find((p) => p.name === 'file')
  if (!file || !file.filename) throw createError({ statusCode: 400, statusMessage: 'file field missing' })

  const mime = String(file.type || '')
  if (!mime.startsWith('audio/')) {
    throw createError({ statusCode: 400, statusMessage: 'Only audio uploads allowed' })
  }
  if (file.data.byteLength > 25 * 1024 * 1024) {
    throw createError({ statusCode: 413, statusMessage: 'Recording too large (25 MB max)' })
  }

  const ext = extFromName(file.filename) || '.webm'
  const name = `${Date.now()}-${randomHex(4)}${ext}`
  const key = `responses/${name}`

  const r2 = useR2(event)
  await r2.put(key, file.data, {
    httpMetadata: { contentType: mime, cacheControl: 'public, max-age=31536000, immutable' },
    customMetadata: { original: file.filename, kind: 'response' }
  })

  const url = r2UrlFor(key)
  return { path: url, key, filename: name, kind: 'audio', contentType: mime }
})

function extFromName(name: string): string {
  const m = /\.([A-Za-z0-9]+)$/.exec(name)
  return m ? `.${m[1].toLowerCase()}` : ''
}

function randomHex(bytes: number): string {
  const buf = new Uint8Array(bytes)
  crypto.getRandomValues(buf)
  return Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('')
}
