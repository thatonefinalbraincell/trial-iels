import { useDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const db = useDb(event)
  return db.all(
    `SELECT id, title, skill, description, duration_min, created_at
     FROM tests t
     WHERE published = 1
       AND (
         t.title LIKE 'Cambridge-style IELTS%'
         OR t.title LIKE 'Cambridge IELTS%'
       )
       AND (
         t.skill <> 'listening'
         OR (
           EXISTS (SELECT 1 FROM sections s WHERE s.test_id = t.id)
           AND NOT EXISTS (
             SELECT 1 FROM sections s
             WHERE s.test_id = t.id
               AND (s.audio_path IS NULL OR trim(s.audio_path) = '')
           )
         )
       )
     ORDER BY skill, id`
  )
})
