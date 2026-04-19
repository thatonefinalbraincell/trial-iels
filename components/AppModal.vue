<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="state.open" class="modal-root" @mousedown.self="cancel" role="dialog" aria-modal="true">
        <div class="modal-card" :class="[`modal-card--${state.variant}`]">
          <button class="modal-close" aria-label="Close" @click="cancel">
            <Icon name="x" :size="16" />
          </button>
          <div class="modal-icon" :class="[`modal-icon--${state.variant}`]">
            <Icon :name="iconName" :size="22" />
          </div>
          <h3 v-if="state.title" class="modal-title">{{ state.title }}</h3>
          <p v-if="state.message" class="modal-message">{{ state.message }}</p>

          <form v-if="state.kind === 'prompt'" class="modal-prompt" @submit.prevent="confirm">
            <input
              ref="promptInput"
              v-model="promptValue"
              class="modal-input"
              :placeholder="state.placeholder || ''"
              autofocus
            />
          </form>

          <div class="modal-actions">
            <button
              v-if="state.kind !== 'alert'"
              type="button"
              class="btn ghost"
              @click="cancel"
            >
              {{ state.cancelText }}
            </button>
            <button
              ref="confirmBtn"
              type="button"
              class="btn"
              :class="[state.variant === 'danger' ? 'danger' : (state.variant === 'success' ? 'success' : 'cta')]"
              @click="confirm"
            >
              <Icon
                v-if="state.variant === 'danger'"
                name="trash" :size="14"
              />
              <Icon
                v-else-if="state.variant === 'success'"
                name="check" :size="14"
              />
              <Icon v-else name="check" :size="14" />
              {{ state.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { _state: state, _resolve } = useModal()
const promptValue = ref('')
const promptInput = ref<HTMLInputElement | null>(null)
const confirmBtn = ref<HTMLButtonElement | null>(null)

const iconName = computed(() => {
  if (state.value.icon) return state.value.icon
  switch (state.value.variant) {
    case 'danger':  return 'alert-triangle'
    case 'success': return 'check-circle'
    case 'warn':    return 'alert-triangle'
    default:        return state.value.kind === 'prompt' ? 'edit' : 'info'
  }
})

watch(() => state.value.open, (open) => {
  if (open) {
    promptValue.value = state.value.defaultValue || ''
    nextTick(() => {
      if (state.value.kind === 'prompt') promptInput.value?.focus()
      else confirmBtn.value?.focus()
    })
  }
})

function confirm() {
  if (state.value.kind === 'prompt') _resolve(promptValue.value)
  else if (state.value.kind === 'confirm') _resolve(true)
  else _resolve(true)
}
function cancel() {
  if (state.value.kind === 'prompt') _resolve(null)
  else if (state.value.kind === 'confirm') _resolve(false)
  else _resolve(true)
}

function onKey(e: KeyboardEvent) {
  if (!state.value.open) return
  if (e.key === 'Escape') { e.preventDefault(); cancel() }
  if (e.key === 'Enter' && state.value.kind !== 'prompt') { e.preventDefault(); confirm() }
}
onMounted(() => { window.addEventListener('keydown', onKey) })
onBeforeUnmount(() => { window.removeEventListener('keydown', onKey) })
</script>

<style scoped>
.modal-root {
  position: fixed; inset: 0; z-index: 100;
  display: flex; align-items: center; justify-content: center;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  padding: 20px;
}
.modal-card {
  position: relative;
  width: 100%; max-width: 440px;
  background: #fff;
  border-radius: 20px;
  padding: 28px 28px 22px;
  box-shadow: 0 24px 48px -12px rgba(15, 23, 42, 0.4);
  border: 1px solid var(--border);
  animation: pop 180ms cubic-bezier(0.2, 0.9, 0.3, 1.2);
}
@keyframes pop {
  from { transform: translateY(8px) scale(0.96); opacity: 0; }
  to   { transform: translateY(0) scale(1); opacity: 1; }
}
.modal-card--danger { border-top: 4px solid var(--err); }
.modal-card--success { border-top: 4px solid var(--ok); }
.modal-card--warn { border-top: 4px solid var(--warn); }
.modal-card--info { border-top: 4px solid var(--primary); }

.modal-close {
  position: absolute; top: 12px; right: 12px;
  width: 32px; height: 32px; border-radius: 10px;
  border: none; background: transparent; color: var(--muted);
  cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
  transition: background 120ms ease;
}
.modal-close:hover { background: var(--surface-2); color: var(--text-strong); }

.modal-icon {
  width: 52px; height: 52px; border-radius: 16px;
  display: inline-flex; align-items: center; justify-content: center;
  margin-bottom: 12px;
}
.modal-icon--info    { background: var(--primary-50); color: var(--primary-700); }
.modal-icon--success { background: #D1FAE5; color: #065F46; }
.modal-icon--warn    { background: #FFFBEB; color: var(--accent-600); }
.modal-icon--danger  { background: #FEE2E2; color: #991B1B; }

.modal-title {
  font-family: 'Crimson Pro', serif;
  font-size: 22px;
  margin: 0 0 6px;
  color: var(--text-strong);
}
.modal-message {
  margin: 0 0 18px;
  color: var(--muted);
  line-height: 1.55;
}
.modal-input {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid var(--border-strong);
  border-radius: 10px;
  font-size: 15px; font-family: inherit;
  margin-bottom: 6px;
}
.modal-input:focus {
  outline: none; border-color: var(--primary);
  box-shadow: var(--shadow-glow);
}
.modal-prompt { margin-bottom: 16px; }
.modal-actions {
  display: flex; justify-content: flex-end; gap: 10px;
  margin-top: 8px;
}

.modal-enter-active, .modal-leave-active { transition: opacity 160ms ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

@media (max-width: 520px) {
  .modal-card { padding: 22px 20px 18px; }
  .modal-actions { flex-direction: column-reverse; }
  .modal-actions .btn { width: 100%; }
}
</style>
