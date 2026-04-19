// Answer validation for every supported IELTS question type.
// Validation is tolerant: lowercase, trimmed, and multiple acceptable answers supported.

function norm(s: any) {
  if (s == null) return ''
  return String(s).trim().toLowerCase().replace(/\s+/g, ' ')
}

function listNorm(a: any): string[] {
  if (Array.isArray(a)) return a.map(norm).filter(Boolean).sort()
  if (a == null) return []
  return [norm(a)]
}

export interface ValidationResult { correct: boolean | null; expected: any }

/**
 * Validate a user's response for one question.
 * @param type  - question type string (see schema.sql)
 * @param answerJson - stored correct answer JSON (parsed)
 * @param response  - user's response (already parsed JSON/value)
 */
export function validate(type: string, answerJson: any, response: any): ValidationResult {
  // Writing/speaking are not auto-scored
  if (type.startsWith('writing_') || type.startsWith('speaking_')) {
    return { correct: null, expected: null }
  }

  // Multiple-choice multi: both arrays; order-independent
  if (type.endsWith('_mcq_multi')) {
    const exp = listNorm(answerJson?.answer ?? answerJson)
    const got = listNorm(response)
    return { correct: exp.length > 0 && exp.length === got.length && exp.every((v, i) => v === got[i]), expected: exp }
  }

  // Standard single-answer types: answer can be string OR array of acceptable alternatives
  const rawAns = answerJson?.answer ?? answerJson
  const acceptable: string[] = Array.isArray(rawAns) ? rawAns.map(norm) : [norm(rawAns)]
  const got = norm(response)
  const isCorrect = acceptable.includes(got)
  return { correct: isCorrect, expected: Array.isArray(rawAns) ? rawAns : rawAns }
}

/**
 * Rough IELTS band conversion from raw score (out of 40).
 * Uses approximate conversion (reading/listening academic).
 */
export function rawToBand(raw: number, total: number): number {
  if (total !== 40) {
    const pct = raw / total
    return Math.round(Math.min(9, pct * 9) * 2) / 2
  }
  // Approximate Cambridge band table
  const table: Record<number, number> = {
    40: 9, 39: 9, 38: 8.5, 37: 8.5, 36: 8, 35: 8, 34: 7.5, 33: 7.5, 32: 7, 31: 7, 30: 7,
    29: 6.5, 28: 6.5, 27: 6.5, 26: 6, 25: 6, 24: 6, 23: 6, 22: 5.5, 21: 5.5, 20: 5.5,
    19: 5, 18: 5, 17: 5, 16: 5, 15: 4.5, 14: 4.5, 13: 4, 12: 4, 11: 4, 10: 3.5,
    9: 3.5, 8: 3, 7: 3, 6: 2.5, 5: 2.5, 4: 2, 3: 2, 2: 1.5, 1: 1, 0: 0
  }
  return table[Math.max(0, Math.min(40, raw))] ?? 0
}
