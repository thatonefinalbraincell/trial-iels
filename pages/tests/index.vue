<template>
  <div class="tests-page">
    <div class="container tests-body">
      <section v-for="skill in skills" :key="skill.key" class="skill-section">
        <div class="skill-section__head">
          <div :class="['skill-icon', `skill-icon--${skill.key}`]">
            <Icon :name="skill.icon" :size="20" />
          </div>
          <div class="skill-section__meta">
            <h2>{{ skill.title }}</h2>
            <p>{{ skill.summary }}</p>
          </div>
        </div>

<<<<<<< Updated upstream
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
=======
        <!-- Reading & Listening: IDP-style practice test cards -->
        <div v-if="skill.key === 'reading' || skill.key === 'listening'" class="idp-section">
          <IdpPracticeTestGrid
            v-if="(byskill[skill.key] || []).length"
            :tests="byskill[skill.key]"
            :skill="skill.key"
            :max="4"
            :show-nav="(byskill[skill.key] || []).length > 4"
          />
          <div v-else class="empty-state">
            <Icon name="file-text" :size="32" />
            <p>No {{ skill.title.toLowerCase() }} tests yet. An admin can add one from the dashboard.</p>
          </div>
        </div>

        <!-- Writing & Speaking: compact list -->
        <div v-else>
          <div v-if="(byskill[skill.key] || []).length" class="test-grid">
            <div v-for="t in byskill[skill.key]" :key="t.id" class="test-card">
              <div>
                <h3>{{ publicTitle(t) }}</h3>
                <p class="test-card__desc">{{ publicDescription(t) }}</p>
                <div class="test-card__meta">
                  <span><Icon name="clock" :size="13" /> {{ t.duration_min }} min</span>
                  <span><Icon name="file-text" :size="13" /> {{ skill.questionInfo }}</span>
                </div>
              </div>
              <NuxtLink :to="`/tests/${skill.key}/${t.id}`" class="test-card__arrow" aria-label="Start test">
                <Icon name="arrow-right" :size="18" />
              </NuxtLink>
            </div>
          </div>
          <div v-else class="empty-state">
            <Icon name="file-text" :size="28" />
            <p>No {{ skill.title.toLowerCase() }} tests yet. An admin can add one from the dashboard.</p>
          </div>
        </div>
      </section>
    </div>
>>>>>>> Stashed changes
  </div>
</template>

<script setup lang="ts">
const { data: tests } = await useFetch<any[]>('/api/tests')
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
const skills = [
  { key: 'reading' as const, title: 'Reading', icon: 'book-open', summary: '3 passages · 60 min · 40 auto-graded questions', questionInfo: '40 Qs' },
  { key: 'listening' as const, title: 'Listening', icon: 'headphones', summary: '4 parts · 40 min · 40 auto-graded questions', questionInfo: '40 Qs' },
  { key: 'writing' as const, title: 'Writing', icon: 'pen-tool', summary: '2 tasks · 60 min · timed with word count', questionInfo: '2 tasks' },
  { key: 'speaking' as const, title: 'Speaking', icon: 'mic', summary: '3 parts · 11–14 min · in-browser recorder', questionInfo: '3 parts' }
]
const byskill = computed(() => {
  const m: Record<string, any[]> = {}
  for (const t of tests.value ?? []) {
    (m[t.skill] ||= []).push(t)
  }
  return m
})

<<<<<<< Updated upstream
useHead({ title: 'Mock IELTS tests — pick a skill' })
=======
useHead({ title: 'IELTS Practice — Cambridge-style mock tests' })

>>>>>>> Stashed changes
function publicTitle(test: any) {
  return test?.title || 'Cambridge-style IELTS mock test'
}

function publicDescription(test: any) {
  return test?.description || 'Cambridge-style mock test'
}
</script>
<<<<<<< Updated upstream
=======

<style scoped>
.tests-body {
  padding: 32px 0 64px;
}

.skill-section {
  margin-bottom: 48px;
  padding-bottom: 48px;
  border-bottom: 1px solid #e9edf2;
}
.skill-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.skill-section__head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}

.skill-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
}
.skill-icon--reading { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.skill-icon--listening { background: linear-gradient(135deg, #e11b2b, #9b1a25); }
.skill-icon--writing { background: linear-gradient(135deg, #10b981, #059669); }
.skill-icon--speaking { background: linear-gradient(135deg, #f59e0b, #d97706); }

.skill-section__meta h2 {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 2px;
}
.skill-section__meta p {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.idp-section {
  margin-top: 4px;
}

.test-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.test-card {
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.test-card:hover {
  border-color: #e11b2b;
  box-shadow: 0 4px 16px rgba(225, 27, 43, 0.08);
}
.test-card h3 {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 3px;
}
.test-card__desc {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 8px;
  line-height: 1.5;
}
.test-card__meta {
  display: flex;
  gap: 14px;
}
.test-card__meta span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #9ca3af;
}
.test-card__arrow {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e11b2b;
  text-decoration: none;
  transition: background 0.15s, transform 0.15s;
}
.test-card__arrow:hover {
  background: #e11b2b;
  color: #fff;
  transform: scale(1.08);
}

.empty-state {
  background: #f9fafb;
  border: 1.5px dashed #d1d5db;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.empty-state p {
  margin: 0;
  font-size: 14px;
}
</style>
>>>>>>> Stashed changes
