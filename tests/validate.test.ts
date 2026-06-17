import test from 'node:test'
import assert from 'node:assert/strict'
import { validate } from '../server/utils/validate.ts'

test('validation skips linked placeholder questions', () => {
  const result = validate('listening_mcq_multi', { ignore: true }, [])
  assert.deepEqual(result, { correct: null, expected: null })
})

test('multi-select answers are order independent', () => {
  const result = validate('listening_mcq_multi', { answer: ['A', 'D'] }, ['D', 'A'])
  assert.equal(result.correct, true)
})
