import { useDb } from '~/server/utils/db'
import { validate, rawToBand } from '~/server/utils/validate'

// Body: { attempt_id, test_id, responses: { [questionId]: any } }
export default defineEventHandler(async (event) => {
  const body = await readBody<{ attempt_id?: number; test_id: number; responses: Record<string, any> }>(event)
  if (!body?.test_id || !body?.responses) {
    throw createError({ statusCode: 400, statusMessage: 'test_id and responses required' })
  }
  const db = useDb(event)
  const test = await db.first<any>('SELECT id, skill FROM tests WHERE id = ?', body.test_id)
  if (!test) throw createError({ statusCode: 404, statusMessage: 'Test not found' })

  // Ensure attempt exists.
  let attemptId = body.attempt_id
  if (!attemptId) {
    const info = await db.run('INSERT INTO attempts (test_id) VALUES (?)', body.test_id)
    attemptId = info.lastInsertRowid
  }

  // Fetch all questions for this test.
  const questions = await db.all<any>(
    `SELECT q.id, q.type, q.answer_json, q.number, q.points
     FROM questions q JOIN sections s ON s.id = q.section_id
     WHERE s.test_id = ? ORDER BY q.number`,
    body.test_id
  )

  let score = 0
  let autoTotal = 0
  const feedback: any[] = []
  const answerStmts: any[] = []
  const answerSql = `INSERT OR REPLACE INTO answers (attempt_id, question_id, response_json, correct)
                     VALUES (?, ?, ?, ?)`

  for (const q of questions) {
    const resp = body.responses[String(q.id)]
    let parsedAns: any = null
    try { parsedAns = q.answer_json ? JSON.parse(q.answer_json) : null } catch {}
    const { correct, expected } = validate(q.type, parsedAns, resp)
    if (correct !== null) autoTotal += q.points
    if (correct === true) score += q.points
    answerStmts.push(db.prepare(
      answerSql,
      attemptId,
      q.id,
      JSON.stringify(resp ?? null),
      correct === null ? null : (correct ? 1 : 0)
    ))
    feedback.push({ question_id: q.id, number: q.number, type: q.type, response: resp ?? null, correct, expected })
  }

  // Persist per-question answers + the attempt summary atomically.
  const band = autoTotal > 0 ? rawToBand(score, autoTotal) : null
  answerStmts.push(db.prepare(
    `UPDATE attempts SET submitted_at = datetime('now'), score = ?, total = ?, band = ?, feedback = ?
     WHERE id = ?`,
    score, autoTotal, band, JSON.stringify(feedback), attemptId
  ))
  await db.batch(answerStmts)

  return { attempt_id: attemptId, score, total: autoTotal, band, feedback }
})
