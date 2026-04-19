import { useDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid attempt id' })
  const db = useDb(event)
  const row = await db.first<any>('SELECT * FROM attempts WHERE id = ?', id)
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Attempt not found' })
  if (row.feedback) { try { row.feedback = JSON.parse(row.feedback) } catch {} }
  return row
})
