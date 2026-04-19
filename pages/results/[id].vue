<template>
  <div class="container" v-if="attempt">
    <header class="section-head" style="text-align:left; max-width:none;">
      <span class="eyebrow"><Icon name="award" :size="14" /> Attempt results</span>
      <h1 style="margin:14px 0 4px;">Your results</h1>
      <p class="text-muted">Automatic scoring for Reading &amp; Listening. Writing and Speaking responses are stored for human review.</p>
    </header>

    <div class="grid-cards" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
      <div class="stat">
        <span class="label">Raw score</span>
        <span class="value">{{ attempt.score }} <span class="text-subtle" style="font-size:18px;">/ {{ attempt.total }}</span></span>
      </div>
      <div class="stat" v-if="attempt.band !== null">
        <span class="label">Estimated band</span>
        <span class="value" style="color:var(--accent-600);">{{ attempt.band }}</span>
        <span class="trend">IELTS 40-Q conversion</span>
      </div>
      <div class="stat" v-else>
        <span class="label">Scoring</span>
        <span class="value" style="font-size:17px; line-height:1.3;">Manual review</span>
        <span class="trend">Writing &amp; Speaking require human or AI evaluation</span>
      </div>
    </div>

    <h2 style="margin-top:32px;">Question review</h2>
    <table class="admin-table">
      <thead>
        <tr><th>#</th><th>Type</th><th>Your response</th><th>Correct answer</th><th>Result</th></tr>
      </thead>
      <tbody>
        <tr v-for="fb in attempt.feedback" :key="fb.question_id">
          <td>{{ fb.number }}</td>
          <td><code style="font-size:12px;">{{ fb.type }}</code></td>
          <td><pre style="margin:0; white-space:pre-wrap; font-family:inherit;">{{ fmt(fb.response) }}</pre></td>
          <td><pre style="margin:0; white-space:pre-wrap; font-family:inherit;">{{ fmt(fb.expected) }}</pre></td>
          <td>
            <span v-if="fb.correct === true" class="badge" style="background:#D1FAE5; color:#065F46;">
              <Icon name="check" :size="12" /> Correct
            </span>
            <span v-else-if="fb.correct === false" class="badge" style="background:#FEE2E2; color:#991B1B;">
              <Icon name="x" :size="12" /> Wrong
            </span>
            <span v-else class="badge" style="background:#FEF3C7; color:#92400E;">
              <Icon name="edit" :size="12" /> Manual
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="row mt-4">
      <NuxtLink to="/tests" class="btn">
        <Icon name="arrow-right" :size="14" style="transform: rotate(180deg);" /> Back to tests
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: attempt } = await useFetch<any>(`/api/attempts/${route.params.id}`)
function fmt(v: any) {
  if (v == null) return '—'
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}
</script>
