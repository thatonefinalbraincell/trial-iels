<template>
  <div class="container answers-page">
    <header class="answers-head">
      <NuxtLink to="/tests" class="back">← Back to tests</NuxtLink>
      <h1>{{ test?.title || 'Answers' }}</h1>
      <p class="text-muted">Correct answers and model responses for this listening test.</p>
    </header>

    <main v-if="test">
      <section v-for="(s, si) in test.sections" :key="s.id" class="section">
        <h2>Part {{ si + 1 }}: {{ s.title }}</h2>
        <p class="text-muted" v-if="s.instructions" v-html="s.instructions"></p>
        <ol class="qa-list">
          <li v-for="q in s.questions" :key="q.id">
            <div class="q-head"><strong>{{ q.number }}.</strong> <span v-html="q.prompt"></span></div>
            <div class="q-answer">Answer: <strong>{{ renderAnswer(q.answer) }}</strong></div>
          </li>
        </ol>
      </section>
    </main>

    <div v-else class="empty">Loading answers…</div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = Number(route.params.id)
const { data: test } = await useFetch<any>(`/api/tests/${id}/answers`)

useHead({ title: test.value?.title ? `${test.value.title} — Answers` : 'Listening test answers' })

function renderAnswer(ans: any) {
  if (!ans) return '—'
  if (ans.answer !== undefined) return Array.isArray(ans.answer) ? ans.answer.join(', ') : String(ans.answer)
  return JSON.stringify(ans)
}
</script>

<style scoped>
.answers-head { margin: 8px 0 18px }
.answers-head .back { color:#6B7280; display:inline-block; margin-bottom:8px }
.answers-page h1 { margin:6px 0 6px }
.section { margin:18px 0; padding:12px 0; border-top:1px solid #F3F4F6 }
.qa-list { list-style: none; padding:0; margin:8px 0 0 }
.qa-list li { padding:10px 0; border-bottom:1px dashed #F3F4F6 }
.q-head { margin-bottom:6px }
.q-answer { color:#111827 }
</style>
