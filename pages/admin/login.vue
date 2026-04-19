<template>
  <div class="admin-login-shell">
    <div class="admin-login-card">
      <div class="admin-login-card__logo">
        <Icon name="shield" :size="20" />
      </div>
      <h1 style="margin:10px 0 4px;">Admin sign-in</h1>
      <p class="text-muted" style="margin:0 0 20px;">Enter the admin password to manage tests and upload audio.</p>
      <form class="form" @submit.prevent="login">
        <label>Password</label>
        <input type="password" v-model="pw" autofocus required />
        <div v-if="err" class="banner err mt-3" role="alert">
          <Icon name="x-circle" :size="18" />
          <span>{{ err }}</span>
        </div>
        <button class="btn cta" style="margin-top:18px; width:100%;" :disabled="loading">
          <Icon name="log-out" :size="16" style="transform: rotate(180deg);" />
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
      <p class="text-xs text-muted mt-4" style="margin-bottom:0;">
        Default password: <code>admin123</code> — override via <code>ADMIN_PASSWORD</code>.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({
  title: 'Admin sign-in',
  meta: [{ name: 'robots', content: 'noindex, nofollow, noarchive, nosnippet' }]
})
const pw = ref('')
const err = ref('')
const loading = ref(false)
async function login() {
  err.value = ''; loading.value = true
  try {
    await $fetch('/api/admin/login', { method: 'POST', body: { password: pw.value } })
    await navigateTo('/admin')
  } catch (e: any) {
    err.value = e?.statusMessage || 'Login failed'
  } finally { loading.value = false }
}
</script>

<style scoped>
.admin-login-shell {
  min-height: calc(100vh - 78px);
  display: flex; align-items: center; justify-content: center;
  padding: 40px 20px;
  background:
    radial-gradient(ellipse at top right, rgba(56, 189, 248, 0.28), transparent 60%),
    radial-gradient(ellipse at bottom left, rgba(251, 191, 36, 0.18), transparent 60%),
    var(--bg);
}
.admin-login-card {
  width: 100%; max-width: 420px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 32px;
  box-shadow: var(--shadow-lg);
}
.admin-login-card__logo {
  width: 52px; height: 52px; border-radius: 14px;
  display: inline-flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: #fff;
  box-shadow: 0 10px 22px -8px rgba(14, 165, 233, 0.6);
}
</style>
