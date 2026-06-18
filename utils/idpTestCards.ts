const LISTENING_LABELS = [
  'Short-answer questions',
  'Sentence completion',
  'Plan/map/diagram labelling',
  'Notes completion',
  'Multiple choice',
  'Matching',
]

const READING_LABELS = [
  'Familiarisation test',
  'Summary Completion (select from list of words)',
  'Table completion',
  'Matching Headings',
  'Matching Information',
  'Identifying Information',
]

export function idpCardTitle(test: { title?: string }, skill: 'reading' | 'listening', index: number) {
  const labels = skill === 'listening' ? LISTENING_LABELS : READING_LABELS
  const label = labels[index] ?? labels[labels.length - 1]
  const prefix = skill === 'listening' ? 'IELTS Listening' : 'IELTS Academic Reading'
  return `${prefix} : ${label}`
}

export function idpCardFormat(skill: 'reading' | 'listening', index: number) {
  if (skill === 'reading' && index === 0) return 'Computer'
  return 'Paper'
}

export function idpTestAccessLink(test: { id: number }, skill: 'reading' | 'listening') {
  if (skill === 'listening') return `/tests/listening/${test.id}?mode=test`
  return `/tests/reading/${test.id}`
}

export function idpTestAnswersLink(test: { id: number }, skill: 'reading' | 'listening') {
  if (skill === 'listening') return `/tests/listening/${test.id}/answers`
  return `/tests/reading/${test.id}/answers`
}
