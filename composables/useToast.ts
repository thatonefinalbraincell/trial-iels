export type ToastVariant = 'info' | 'success' | 'warn' | 'danger'
export interface Toast {
  id: number
  message: string
  title?: string
  variant: ToastVariant
  duration: number
}

export function useToastState() {
  return useState<Toast[]>('app-toasts', () => [])
}

let nextId = 1
export function useToast() {
  const toasts = useToastState()
  function push(message: string, opts: Partial<Toast> = {}) {
    const id = nextId++
    const t: Toast = {
      id,
      message,
      title: opts.title,
      variant: opts.variant || 'info',
      duration: opts.duration ?? 3500
    }
    toasts.value = [...toasts.value, t]
    if (t.duration > 0) {
      setTimeout(() => dismiss(id), t.duration)
    }
    return id
  }
  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }
  return {
    success: (msg: string, o: Partial<Toast> = {}) => push(msg, { ...o, variant: 'success' }),
    error:   (msg: string, o: Partial<Toast> = {}) => push(msg, { ...o, variant: 'danger' }),
    warn:    (msg: string, o: Partial<Toast> = {}) => push(msg, { ...o, variant: 'warn' }),
    info:    (msg: string, o: Partial<Toast> = {}) => push(msg, { ...o, variant: 'info' }),
    dismiss
  }
}
