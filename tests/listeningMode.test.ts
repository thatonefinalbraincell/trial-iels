import test from 'node:test'
import assert from 'node:assert/strict'
import {
  allowsAudioReplay,
  listeningModePath,
  normalizeListeningMode,
  usesExamTiming
} from '../utils/listeningMode.ts'

test('defaults to practice mode for missing or unknown values', () => {
  assert.equal(normalizeListeningMode(undefined), 'practice')
  assert.equal(normalizeListeningMode('review'), 'practice')
})

test('test mode is time-bounded and does not allow replay', () => {
  const mode = normalizeListeningMode('test')

  assert.equal(mode, 'test')
  assert.equal(usesExamTiming(mode), true)
  assert.equal(allowsAudioReplay(mode), false)
})

test('practice mode allows replay and builds the expected route', () => {
  const mode = normalizeListeningMode('practice')

  assert.equal(allowsAudioReplay(mode), true)
  assert.equal(usesExamTiming(mode), false)
  assert.equal(listeningModePath(42, mode), '/tests/listening/42?mode=practice')
})
