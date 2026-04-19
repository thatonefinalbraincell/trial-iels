<template>
  <div v-if="test">
    <header class="ielts-topbar">
      <div class="brand">
        <span class="dot"><Icon name="headphones" :size="14" /></span>
        IELTS Listening
      </div>
      <div class="meta">
        <span class="candidate"><Icon name="user" :size="14" /> Candidate · {{ test.title }}</span>
        <span class="timer" :class="{ low: remaining <= 300 }">
          <Icon name="clock" :size="14" /> {{ timeDisplay }}
        </span>
        <button class="topbtn" @click="submit"><Icon name="check" :size="13" /> Submit</button>
      </div>
    </header>

    <section class="split">
      <div class="panel">
        <h2>Part {{ currentSectionIndex + 1 }}: {{ currentSection?.title }}</h2>
        <p class="text-muted text-sm">{{ currentSection?.instructions }}</p>
        <div v-if="currentSection?.audio_path">
          <p class="text-muted text-sm" style="margin-top:12px;">
            Press play to start this part. In a real exam, audio is played once, cannot be paused, and there is no replay.
          </p>
          <audio ref="audio" :src="currentSection.audio_path" controls style="width:100%;"></audio>
        </div>
        <div v-else class="banner warn" style="margin-top:12px;">
          <Icon name="alert-triangle" :size="18" />
          <span>Audio for this part has not been uploaded yet. Ask an admin to upload it from the <code>Audio uploads</code> page.</span>
        </div>
        <div v-if="currentSection?.image_path" style="margin-top:12px;">
          <img :src="currentSection.image_path" alt="question diagram" style="max-width:100%; border:1px solid var(--border); border-radius:var(--radius);"/>
        </div>
      </div>
      <div class="panel questions">
        <h2>Questions {{ sectionQuestionRange(currentSection) }}</h2>
        <template v-for="group in groupedQuestions(currentSection)" :key="group.type + group.from">
          <div class="qsection-title">
            Questions {{ group.from }}–{{ group.to }}: {{ typeLabel(group.type) }}
          </div>
          <QuestionRenderer v-for="q in group.items" :key="q.id" :question="q"
                            :model-value="responses[q.id]"
                            @update="val => setResponse(q.id, val)" />
        </template>
      </div>
    </section>

    <footer class="ielts-bottombar">
      <div v-for="(s, si) in test.sections" :key="s.id" class="nav-group">
        <span class="label">Part {{ si + 1 }}</span>
        <button v-for="q in s.questions" :key="q.id"
                class="nav-btn"
                :class="{ answered: !!responses[q.id], current: currentSectionIndex === si }"
                @click="goTo(si)">{{ q.number }}</button>
      </div>
      <div style="margin-left:auto; display:flex; gap:8px; padding-right:8px;">
        <button class="btn secondary sm" :disabled="currentSectionIndex === 0" @click="currentSectionIndex--">
          <Icon name="chevron-left" :size="14" /> Prev
        </button>
        <button class="btn sm" v-if="currentSectionIndex < (test.sections.length - 1)" @click="currentSectionIndex++">
          Next <Icon name="chevron-right" :size="14" />
        </button>
        <button class="btn cta sm" v-else @click="submit">
          <Icon name="check" :size="14" /> Finish
        </button>
      </div>
    </footer>
  </div>
  <div v-else class="container"><p>Loading test...</p></div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'test' })
const route = useRoute()
const router = useRouter()
const testId = Number(route.params.id)

const { data: test } = await useFetch<any>(`/api/tests/${testId}`)
const responses = reactive<Record<number, any>>({})
const currentSectionIndex = ref(0)
const currentSection = computed(() => test.value?.sections?.[currentSectionIndex.value])

const duration = computed(() => (test.value?.duration_min || 40) * 60)
const remaining = ref(0)
const timeDisplay = computed(() => {
  const s = remaining.value
  const m = Math.floor(s / 60), sec = s % 60
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
})
onMounted(() => {
  remaining.value = duration.value
  const iv = setInterval(() => {
    remaining.value--
    if (remaining.value <= 0) { clearInterval(iv); submit() }
  }, 1000)
})

function setResponse(qid: number, v: any) { responses[qid] = v }
function goTo(si: number) { currentSectionIndex.value = si }
function sectionQuestionRange(s: any) {
  if (!s?.questions?.length) return ''
  const nums = s.questions.map((q: any) => q.number).filter((n: any) => n != null)
  return nums.length ? `${Math.min(...nums)}-${Math.max(...nums)}` : ''
}
function groupedQuestions(s: any) {
  if (!s?.questions) return []
  const groups: any[] = []
  let cur: any = null
  for (const q of s.questions) {
    if (!cur || cur.type !== q.type) {
      cur = { type: q.type, from: q.number, to: q.number, items: [q] }
      groups.push(cur)
    } else { cur.items.push(q); cur.to = q.number }
  }
  return groups
}
function typeLabel(t: string) {
  const map: Record<string,string> = {
    listening_form_completion: 'Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
    listening_note_completion: 'Complete the notes. Write NO MORE THAN TWO WORDS for each answer.',
    listening_table_completion: 'Complete the table. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
    listening_flowchart_completion: 'Complete the flow-chart.',
    listening_summary_completion: 'Complete the summary.',
    listening_sentence_completion: 'Complete the sentences.',
    listening_mcq_single: 'Choose the correct letter A, B or C.',
    listening_mcq_multi: 'Choose TWO letters.',
    listening_matching: 'Match each item with the correct option.',
    listening_map_labelling: 'Label the map/plan below.',
    listening_short_answer: 'Answer the questions.'
  }
  return map[t] || t
}

const modal = useModal()
async function submit() {
  const answered = Object.keys(responses).length
  const totalQs = (test.value?.sections || []).reduce((n: number, s: any) => n + (s.questions?.length || 0), 0)
  const ok = await modal.confirm({
    title: 'Submit your answers?',
    message: `You have answered ${answered} of ${totalQs} questions. Once submitted, you cannot change your responses.`,
    confirmText: 'Submit listening',
    cancelText: 'Keep going',
    variant: 'info'
  })
  if (!ok) return
  const res: any = await $fetch('/api/attempts/submit', {
    method: 'POST', body: { test_id: testId, responses }
  })
  router.push(`/results/${res.attempt_id}`)
}
</script>
