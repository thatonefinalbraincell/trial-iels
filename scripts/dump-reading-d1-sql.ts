import Database from 'better-sqlite3'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const dbPath = resolve(process.cwd(), './data/ielts.sqlite')
const outPath = resolve(process.cwd(), './data/reading-seed.sql')

const db = new Database(dbPath, { readonly: true })
const tests = db.prepare(`
  SELECT * FROM tests
  WHERE skill = 'reading'
    AND title LIKE 'Cambridge-style IELTS Academic Reading%'
  ORDER BY id
`).all() as Record<string, any>[]

if (!tests.length) {
  console.error('[dump-reading] missing local Cambridge-style reading tests')
  process.exit(1)
}

const out: string[] = []
out.push('-- Targeted IELTS Reading seed.')
out.push('-- Replaces only Cambridge-style IELTS Academic Reading tests and related attempts/answers.')
out.push('PRAGMA foreign_keys = ON;')
out.push('')
out.push(`DELETE FROM answers WHERE question_id IN (
  SELECT q.id FROM questions q
  JOIN sections s ON s.id = q.section_id
  JOIN tests t ON t.id = s.test_id
  WHERE t.skill = 'reading' AND t.title LIKE 'Cambridge-style IELTS Academic Reading%'
);`)
out.push(`DELETE FROM attempts WHERE test_id IN (
  SELECT id FROM tests
  WHERE skill = 'reading' AND title LIKE 'Cambridge-style IELTS Academic Reading%'
);`)
out.push(`DELETE FROM questions WHERE section_id IN (
  SELECT s.id FROM sections s
  JOIN tests t ON t.id = s.test_id
  WHERE t.skill = 'reading' AND t.title LIKE 'Cambridge-style IELTS Academic Reading%'
);`)
out.push(`DELETE FROM sections WHERE test_id IN (
  SELECT id FROM tests
  WHERE skill = 'reading' AND title LIKE 'Cambridge-style IELTS Academic Reading%'
);`)
out.push(`DELETE FROM tests WHERE skill = 'reading' AND title LIKE 'Cambridge-style IELTS Academic Reading%';`)

for (const test of tests) {
  const sections = db.prepare('SELECT * FROM sections WHERE test_id = ? ORDER BY order_index').all(test.id) as Record<string, any>[]
  const questions = db.prepare(`
    SELECT q.*, s.order_index AS section_order
    FROM questions q
    JOIN sections s ON s.id = q.section_id
    WHERE s.test_id = ?
    ORDER BY s.order_index, q.order_index
  `).all(test.id) as Record<string, any>[]

  out.push('')
  out.push(`INSERT INTO tests (title, skill, description, duration_min, published)
VALUES (${sql(test.title)}, ${sql(test.skill)}, ${sql(test.description)}, ${test.duration_min}, ${test.published ?? 1});`)

  for (const section of sections) {
    out.push('')
    out.push(`INSERT INTO sections (test_id, order_index, title, instructions, body, audio_path, image_path, extra_json)
SELECT id, ${section.order_index}, ${sql(section.title)}, ${sql(section.instructions)}, ${sql(section.body)}, ${sql(section.audio_path)}, ${sql(section.image_path)}, ${sql(section.extra_json)}
FROM tests WHERE title = ${sql(test.title)};`)

    for (const question of questions.filter(q => q.section_order === section.order_index)) {
      out.push(`INSERT INTO questions (section_id, order_index, number, type, prompt, data_json, answer_json, points)
SELECT s.id, ${question.order_index}, ${question.number}, ${sql(question.type)}, ${sql(question.prompt)}, ${sql(question.data_json)}, ${sql(question.answer_json)}, ${question.points ?? 1}
FROM sections s
JOIN tests t ON t.id = s.test_id
WHERE t.title = ${sql(test.title)} AND s.order_index = ${section.order_index};`)
    }
  }
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, out.join('\n'))
db.close()
console.log(`[dump-reading] wrote ${outPath} (${tests.length} tests)`)

function sql(value: any): string {
  if (value === null || value === undefined) return 'NULL'
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'NULL'
  if (typeof value === 'boolean') return value ? '1' : '0'
  return `'${String(value).replace(/'/g, "''")}'`
}
