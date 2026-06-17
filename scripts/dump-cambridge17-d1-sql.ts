import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { cambridge17ListeningTest1 } from './data/cambridge17ListeningTest1.ts'

const outPath = resolve(process.cwd(), './data/cambridge17-seed.sql')
const title = cambridge17ListeningTest1.title

const out: string[] = []
out.push('-- Targeted Cambridge IELTS 17 Listening Test 1 seed.')
out.push('-- Replaces only this test and its related attempts/answers.')
out.push('PRAGMA foreign_keys = ON;')
out.push('')
out.push(`DELETE FROM answers WHERE question_id IN (
  SELECT q.id FROM questions q
  JOIN sections s ON s.id = q.section_id
  JOIN tests t ON t.id = s.test_id
  WHERE t.title = ${sql(title)}
);`)
out.push(`DELETE FROM attempts WHERE test_id IN (SELECT id FROM tests WHERE title = ${sql(title)});`)
out.push(`DELETE FROM questions WHERE section_id IN (
  SELECT s.id FROM sections s
  JOIN tests t ON t.id = s.test_id
  WHERE t.title = ${sql(title)}
);`)
out.push(`DELETE FROM sections WHERE test_id IN (SELECT id FROM tests WHERE title = ${sql(title)});`)
out.push(`DELETE FROM tests WHERE title = ${sql(title)};`)
out.push('')
out.push(`INSERT INTO tests (title, skill, description, duration_min, published)
VALUES (${sql(title)}, ${sql(cambridge17ListeningTest1.skill)}, ${sql(cambridge17ListeningTest1.description)}, ${cambridge17ListeningTest1.duration_min}, 1);`)

for (const [sectionIndex, section] of cambridge17ListeningTest1.sections.entries()) {
  const extra = {
    ...(section.extra ?? {}),
    source_pdf: cambridge17ListeningTest1.extra.source_pdf,
    source_question_page: cambridge17ListeningTest1.extra.source_question_page,
    modes: cambridge17ListeningTest1.extra.modes,
    test_mode_audio: cambridge17ListeningTest1.extra.test_mode_audio,
    practice_mode_audio: cambridge17ListeningTest1.extra.practice_mode_audio
  }
  out.push('')
  out.push(`INSERT INTO sections (test_id, order_index, title, instructions, body, audio_path, image_path, extra_json)
SELECT id, ${sectionIndex}, ${sql(section.title)}, ${sql(section.instructions)}, ${sql(section.body)}, ${sql(section.audio_path)}, NULL, ${sql(JSON.stringify(extra))}
FROM tests WHERE title = ${sql(title)};`)

  for (const [questionIndex, question] of section.questions.entries()) {
    const dataJson = question.data ? JSON.stringify(question.data) : null
    const answerJson = question.answer !== undefined ? JSON.stringify(question.answer) : null
    out.push(`INSERT INTO questions (section_id, order_index, number, type, prompt, data_json, answer_json, points)
SELECT s.id, ${questionIndex}, ${question.number}, ${sql(question.type)}, ${sql(question.prompt)}, ${sql(dataJson)}, ${sql(answerJson)}, ${question.points ?? 1}
FROM sections s
JOIN tests t ON t.id = s.test_id
WHERE t.title = ${sql(title)} AND s.order_index = ${sectionIndex};`)
  }
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, out.join('\n'))
console.log(`[dump-cambridge17] wrote ${outPath}`)

function sql(value: any): string {
  if (value === null || value === undefined) return 'NULL'
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'NULL'
  if (typeof value === 'boolean') return value ? '1' : '0'
  return `'${String(value).replace(/'/g, "''")}'`
}
