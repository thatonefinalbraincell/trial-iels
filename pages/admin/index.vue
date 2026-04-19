<template>
  <div>
    <h1>Dashboard</h1>
    <p class="subtitle">The 4 mock tests ship fully pre-seeded. The only asset you need to upload is <strong>listening audio</strong>. Everything else (passages, questions, prompts, cue cards) is already saved in the database.</p>

    <div class="audio-hero">
      <div class="audio-hero__icon"><Icon name="music" :size="24" /></div>
      <div style="flex:1;">
        <h3>Upload listening audio</h3>
        <p>Attach .mp3 / .wav files to each Listening Part. Audio is the only asset admins need to upload — everything else is already seeded.</p>
      </div>
      <NuxtLink to="/admin/audio" class="btn cta">
        <Icon name="upload" :size="16" />
        Upload audio
      </NuxtLink>
    </div>

    <div class="grid-cards" style="margin-top:4px;">
      <div class="stat">
        <span class="label">Total tests</span>
        <span class="value">{{ stats.tests }}</span>
        <span class="trend">Pre-seeded, editable</span>
      </div>
      <div class="stat">
        <span class="label">Reading</span>
        <span class="value">{{ counts.reading }}</span>
      </div>
      <div class="stat">
        <span class="label">Listening</span>
        <span class="value">{{ counts.listening }}</span>
      </div>
      <div class="stat">
        <span class="label">Writing</span>
        <span class="value">{{ counts.writing }}</span>
      </div>
      <div class="stat">
        <span class="label">Speaking</span>
        <span class="value">{{ counts.speaking }}</span>
      </div>
    </div>

    <h2 style="margin-top:32px;">Quick navigation</h2>
    <div class="grid-cards">
      <NuxtLink to="/admin/tests" class="card interactive">
        <span class="badge">All tests</span>
        <h3 style="margin:10px 0 4px;"><Icon name="file-text" :size="16" /> Tests library</h3>
        <p class="text-muted text-sm">Create, edit or publish any of the pre-seeded mock tests.</p>
      </NuxtLink>
      <NuxtLink to="/admin/reading" class="card interactive">
        <span class="badge reading">Reading</span>
        <h3 style="margin:10px 0 4px;"><Icon name="book-open" :size="16" /> Reading tests</h3>
        <p class="text-muted text-sm">3 passages, 40 questions — auto-graded.</p>
      </NuxtLink>
      <NuxtLink to="/admin/listening" class="card interactive">
        <span class="badge listening">Listening</span>
        <h3 style="margin:10px 0 4px;"><Icon name="headphones" :size="16" /> Listening tests</h3>
        <p class="text-muted text-sm">4 parts with audio uploads per part.</p>
      </NuxtLink>
      <NuxtLink to="/admin/writing" class="card interactive">
        <span class="badge writing">Writing</span>
        <h3 style="margin:10px 0 4px;"><Icon name="pen-tool" :size="16" /> Writing tasks</h3>
        <p class="text-muted text-sm">Task 1 and Task 2 prompts with word counts.</p>
      </NuxtLink>
      <NuxtLink to="/admin/speaking" class="card interactive">
        <span class="badge speaking">Speaking</span>
        <h3 style="margin:10px 0 4px;"><Icon name="mic" :size="16" /> Speaking prompts</h3>
        <p class="text-muted text-sm">3-part interview with cue cards.</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const { data: tests } = await useFetch<any[]>('/api/admin/tests')
const stats = reactive({ tests: 0 })
const counts = reactive({ reading: 0, listening: 0, writing: 0, speaking: 0 })
onMounted(() => {
  const list = tests.value || []
  stats.tests = list.length
  for (const t of list) {
    if (counts.hasOwnProperty(t.skill)) (counts as any)[t.skill]++
  }
})
</script>
