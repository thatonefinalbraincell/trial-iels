import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const pageUrl = 'https://engnovate.com/ielts-listening-tests/cambridge-ielts-17-academic-listening-test-1/'
const outputDir = resolve(process.cwd(), 'public/uploads/audio')

async function main() {
  const res = await fetch(pageUrl)
  if (!res.ok) throw new Error(`Failed to fetch ${pageUrl}: ${res.status}`)
  const html = await res.text()
  const urls = [...new Set([...html.matchAll(/https:\/\/engnovate\.com\/wp-content\/uploads\/[^"'\s]+cambridge-ielts-17-academic-listening-1-audio-\d\.mp3/g)].map((m) => m[0]))]
    .sort()

  if (urls.length !== 4) {
    throw new Error(`Expected 4 Cambridge 17 audio files, found ${urls.length}`)
  }

  await mkdir(outputDir, { recursive: true })
  for (const [index, url] of urls.entries()) {
    const part = index + 1
    const outPath = resolve(outputDir, `cambridge-17-test-1-part-${part}.mp3`)
    if (existsSync(outPath)) {
      console.log(`[audio] exists: ${outPath}`)
      continue
    }
    const audioRes = await fetch(url)
    if (!audioRes.ok) throw new Error(`Failed to fetch audio ${part}: ${audioRes.status}`)
    const bytes = Buffer.from(await audioRes.arrayBuffer())
    await writeFile(outPath, bytes)
    console.log(`[audio] wrote ${outPath} (${bytes.length} bytes)`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
