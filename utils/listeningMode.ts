export type ListeningMode = 'practice' | 'test'

export function normalizeListeningMode(value: unknown): ListeningMode {
  return value === 'test' ? 'test' : 'practice'
}

export function allowsAudioReplay(mode: ListeningMode): boolean {
  return mode === 'practice'
}

export function usesExamTiming(mode: ListeningMode): boolean {
  return mode === 'test'
}

export function listeningModePath(testId: number | string, mode: ListeningMode): string {
  return `/tests/listening/${testId}?mode=${mode}`
}
