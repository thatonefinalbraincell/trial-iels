<template>
  <Teleport to="body">
    <div class="toast-stack" role="status" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="toast"
          :class="[`toast--${t.variant}`]"
        >
          <span class="toast-icon">
            <Icon :name="iconFor(t.variant)" :size="16" />
          </span>
          <div class="toast-body">
            <div v-if="t.title" class="toast-title">{{ t.title }}</div>
            <div class="toast-message">{{ t.message }}</div>
          </div>
          <button class="toast-close" aria-label="Dismiss" @click="dismiss(t.id)">
            <Icon name="x" :size="14" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const toasts = useToastState()
const { dismiss } = useToast()
function iconFor(v: string) {
  if (v === 'success') return 'check-circle'
  if (v === 'danger') return 'x-circle'
  if (v === 'warn') return 'alert-triangle'
  return 'info'
}
</script>

<style scoped>
.toast-stack {
  position: fixed; right: 20px; bottom: 20px; z-index: 90;
  display: flex; flex-direction: column; gap: 10px;
  pointer-events: none;
  max-width: min(calc(100vw - 40px), 380px);
}
.toast {
  pointer-events: auto;
  display: flex; align-items: flex-start; gap: 10px;
  background: #fff;
  border: 1px solid var(--border);
  border-left-width: 4px;
  border-radius: 12px;
  padding: 12px 14px;
  box-shadow: 0 14px 32px -10px rgba(15, 23, 42, 0.25);
}
.toast--info    { border-left-color: var(--primary); }
.toast--success { border-left-color: var(--ok); }
.toast--warn    { border-left-color: var(--warn); }
.toast--danger  { border-left-color: var(--err); }

.toast-icon {
  width: 28px; height: 28px; border-radius: 8px;
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.toast--info    .toast-icon { background: var(--primary-50); color: var(--primary-700); }
.toast--success .toast-icon { background: #D1FAE5; color: #065F46; }
.toast--warn    .toast-icon { background: #FFFBEB; color: var(--accent-600); }
.toast--danger  .toast-icon { background: #FEE2E2; color: #991B1B; }

.toast-body { flex: 1; min-width: 0; }
.toast-title { font-weight: 700; font-size: 14px; color: var(--text-strong); margin-bottom: 2px; }
.toast-message { font-size: 14px; color: var(--muted); line-height: 1.4; word-wrap: break-word; }
.toast-close {
  background: none; border: none; color: var(--subtle); cursor: pointer;
  padding: 4px; border-radius: 6px; transition: background 120ms ease, color 120ms ease;
}
.toast-close:hover { background: var(--surface-2); color: var(--text-strong); }

.toast-enter-active, .toast-leave-active { transition: all 180ms ease; }
.toast-enter-from { transform: translateX(20px); opacity: 0; }
.toast-leave-to   { transform: translateX(20px); opacity: 0; }
</style>
