<template>
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <h2>
        <span class="brand-mark__logo" style="width:30px; height:30px; border-radius:9px;">
          <Icon name="shield" :size="14" />
        </span>
        Admin
      </h2>
      <NuxtLink to="/admin"><Icon name="dashboard" :size="16" /> Dashboard</NuxtLink>
      <NuxtLink to="/admin/tests"><Icon name="file-text" :size="16" /> All tests</NuxtLink>
      <NuxtLink to="/admin/reading"><Icon name="book-open" :size="16" /> Reading</NuxtLink>
      <NuxtLink to="/admin/listening"><Icon name="headphones" :size="16" /> Listening</NuxtLink>
      <NuxtLink to="/admin/writing"><Icon name="pen-tool" :size="16" /> Writing</NuxtLink>
      <NuxtLink to="/admin/speaking"><Icon name="mic" :size="16" /> Speaking</NuxtLink>
      <NuxtLink to="/admin/audio"><Icon name="upload" :size="16" /> Audio uploads</NuxtLink>
      <a href="#" @click.prevent="logout"><Icon name="log-out" :size="16" /> Logout</a>
    </aside>
    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Keep admin out of search engines and browser link previews
useHead({
  title: 'Admin — IELTS Practice',
  meta: [
    { name: 'robots', content: 'noindex, nofollow, noarchive, nosnippet' },
    { name: 'referrer', content: 'no-referrer' }
  ]
})

const logout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}
</script>
