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
     ORDER BY skill, id`
  )
})
