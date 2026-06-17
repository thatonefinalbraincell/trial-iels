<template>
  <div class="container tests-index">
    <header class="section-head" style="text-align:left; max-width:none;">
      <span class="eyebrow"><Icon name="list" :size="14" /> Mock test library</span>
      <h1 style="margin:14px 0 6px;">Choose a test to begin</h1>
      <p>Every paper is a full-length, timed mock delivered in the same interface as the real computer-based IELTS. Anonymous attempts are supported.</p>
    </header>

    <section
      v-for="skill in skills" :key="skill.key"
      class="skill-section"
    >
      <div class="skill-section__head">
        <span :class="['feature-card__icon', `feature-card--${skill.key}`]">
          <Icon :name="skill.icon" :size="18" />
        </span>
        <div>
          <h2>{{ skill.title }}</h2>
          <p class="text-muted text-sm" style="margin:0;">{{ skill.summary }}</p>
        </div>
      </div>

      <div v-if="(byskill[skill.key] || []).length" class="test-grid">
        <div
          v-for="t in byskill[skill.key]" :key="t.id"
          class="test-card"
        >
          <div>
            <h3>{{ publicTitle(t) }}</h3>
            <p class="text-muted text-sm" style="margin:2px 0 6px;">{{ publicDescription(t) }}</p>
            <div class="meta">
              <span><Icon name="clock" :size="14" /> {{ t.duration_min }} min</span>
              <span><Icon name="file-text" :size="14" /> {{ skill.questionInfo }}</span>
            </div>
          </div>
          <div v-if="skill.key === 'listening'" class="test-card-actions">
            <NuxtLink :to="`/tests/listening/${t.id}?mode=practice`" class="btn secondary sm">Practice</NuxtLink>
            <NuxtLink :to="`/tests/listening/${t.id}?mode=test`" class="btn sm">Test mode</NuxtLink>
          </div>
          <NuxtLink v-else :to="`/tests/${skill.key}/${t.id}`" class="arrow" aria-label="Start test">
            <Icon name="arrow-right" :size="18" />
          </NuxtLink>
        </div>
      </div>

      <div v-else class="empty">
        <Icon name="file-text" :size="28" />
        <p style="margin:6px 0 0;">No {{ skill.title.toLowerCase() }} tests yet. An admin can add one from the dashboard.</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: tests } = await useFetch<any[]>('/api/tests')
const skills = [
  { key: 'reading',   title: 'Reading',   icon: 'book-open',  summary: '3 passages · 40 auto-graded questions', questionInfo: '40 Qs' },
  { key: 'listening', title: 'Listening', icon: 'headphones', summary: '4 parts · 40 auto-graded questions',    questionInfo: '40 Qs' },
  { key: 'writing',   title: 'Writing',   icon: 'pen-tool',   summary: '2 tasks · timed with word count',       questionInfo: '2 tasks' },
  { key: 'speaking',  title: 'Speaking',  icon: 'mic',        summary: '3 parts · in-browser recorder',         questionInfo: '3 parts' }
]
const byskill = computed(() => {
  const m: Record<string, any[]> = {}
  for (const t of tests.value ?? []) {
    (m[t.skill] ||= []).push(t)
  }
  return m
})

useHead({ title: 'Mock IELTS tests — pick a skill' })
function publicTitle(test: any) {
  if (test?.title === 'Cambridge IELTS 17 Academic Listening Test 1') {
    return 'Cambridge-style IELTS Academic Listening - Mock Test 1'
  }
  return test?.title || 'Cambridge-style IELTS mock test'
}

function publicDescription(test: any) {
  if (test?.title === 'Cambridge IELTS 17 Academic Listening Test 1') {
    return 'Cambridge-style listening practice with four audio parts, practice mode and one-play test mode.'
  }
  return test?.description || 'Cambridge-style mock test'
}
</script>
