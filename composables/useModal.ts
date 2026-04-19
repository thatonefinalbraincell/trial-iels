// Global modal store — replaces window.alert / window.confirm / window.prompt
// Usage:
//   const { alert, confirm, prompt } = useModal()
//   await alert({ title: 'Oops', message: '…' })
//   if (await confirm({ title: 'Delete?', message: '…', danger: true })) { … }
//   const v = await prompt({ title: 'Name', label: 'Enter your name' })

export type ModalKind = 'alert' | 'confirm' | 'prompt'
export type ModalVariant = 'info' | 'success' | 'warn' | 'danger'

export interface ModalOptions {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  variant?: ModalVariant
  danger?: boolean
  icon?: string
  placeholder?: string
  defaultValue?: string
}

interface ModalState extends ModalOptions {
  open: boolean
  kind: ModalKind
  _resolve?: (v: any) => void
}

// Single shared state across the app via Nuxt's useState
export function useModalState() {
  return useState<ModalState>('app-modal', () => ({
    open: false,
    kind: 'alert',
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: 'Cancel',
    variant: 'info',
    danger: false,
    icon: '',
    placeholder: '',
    defaultValue: ''
  }))
}

export function useModal() {
  const state = useModalState()

  function open(kind: ModalKind, opts: ModalOptions) {
    return new Promise<any>((resolve) => {
      state.value = {
        ...state.value,
        ...opts,
        kind,
        open: true,
        confirmText: opts.confirmText || (kind === 'confirm' ? 'Confirm' : 'OK'),
        cancelText: opts.cancelText || 'Cancel',
        variant: opts.variant || (opts.danger ? 'danger' : 'info'),
        _resolve: resolve
      }
    })
  }

  function alertModal(opts: ModalOptions | string) {
    const o = typeof opts === 'string' ? { message: opts } : opts
    return open('alert', o)
  }
  function confirmModal(opts: ModalOptions | string) {
    const o = typeof opts === 'string' ? { message: opts } : opts
    return open('confirm', o) as Promise<boolean>
  }
  function promptModal(opts: ModalOptions | string) {
    const o = typeof opts === 'string' ? { message: opts } : opts
    return open('prompt', o) as Promise<string | null>
  }

  function resolve(value: any) {
    const r = state.value._resolve
    state.value.open = false
    state.value._resolve = undefined
    if (r) r(value)
  }

  return {
    alert: alertModal,
    confirm: confirmModal,
    prompt: promptModal,
    _resolve: resolve,
    _state: state
  }
}
