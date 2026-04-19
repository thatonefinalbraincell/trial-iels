<template>
  <div v-if="test">
    <!-- IELTS-style topbar -->
    <header class="ielts-topbar">
      <div class="brand">
        <span class="dot"><Icon name="book-open" :size="14" /></span>
        IELTS Reading
      </div>
      <div class="meta">
        <span class="candidate"><Icon name="user" :size="14" /> Candidate · {{ test.title }}</span>
        <span class="timer" :class="{ low: remaining <= 300 }">
          <Icon name="clock" :size="14" />
          {{ timeDisplay }}
        </span>
        <button class="topbtn" @click="submit"><Icon name="check" :size="13" /> Submit</button>
      </div>
    </header>

    <!-- Split: passage left | questions right (like real IELTS CDI) -->
    <section class="split">
      <div class="panel passage">
        <h2>{{ currentSection?.title }}</h2>
        <p class="text-muted text-sm">{{ currentSection?.instructions }}</p>
        <div v-html="currentSection?.body"></div>
      </div>
      <div class="panel questions">
        <h2>Questions {{ sectionQuestionRange(currentSection) }}</h2>
        <template v-for="group in groupedQuestions(currentSection)" :key="group.type + group.from">
          <div class="qsection-title">
            Questions {{ group.from }}–{{ group.to }}: {{ typeLabel(group.type) }}
          </div>
          <!-- Matching headings list -->
          <div v-if="group.type === 'reading_matching_headings'" class="instructions">
            <strong>List of Headings</strong>
            <ol style="list-style-type: upper-roman;">
              <li v-for="h in group.items[0]?.data?.headings || []" :key="h.id">{{ h.text }}</li>
            </ol>
          </div>
          <QuestionRenderer v-for="q in group.items" :key="q.id" :question="q"
                            :model-value="responses[q.id]"
                            @update="val => setResponse(q.id, val)" />
        </template>
      </div>
    </section>

    <!-- Bottom question navigator (IELTS-style) -->
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
          <Icon name="chevron-left" :size="14" /> Prev passage
        </button>
        <button class="btn sm" v-if="currentSectionIndex < (test.sections.length - 1)" @click="currentSectionIndex++">
          Next passage <Icon name="chevron-right" :size="14" />
        </button>
        <button class="btn cta sm" v-else @click="submit">
          <Icon name="check" :size="14" /> Finish
        </button>
      </div>
    </footer>
  </div>
  <div v-else class="container"><p>Loading test…</p></div>
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

const duration = computed(() => (test.value?.duration_min || 60) * 60)
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
  return nums.length ? `${Math.min(...nums)}–${Math.max(...nums)}` : ''
}

function groupedQuestions(s: any) {
  if (!s?.questions) return []
  const groups: any[] = []
  let cur: any = null
  for (const q of s.questions) {
    if (!cur || cur.type !== q.type) {
      cur = { type: q.type, from: q.number, to: q.number, items: [q] }
      groups.push(cur)
    } else {
      cur.items.push(q); cur.to = q.number
    }
  }
  return groups
}

function typeLabel(t: string) {
  const map: Record<string,string> = {
    reading_matching_headings: 'Choose the correct heading for each paragraph.',
    reading_tfng: 'Do the statements agree with the information in the passage? (TRUE / FALSE / NOT GIVEN)',
    reading_ynng: 'Do the statements agree with the views of the writer? (YES / NO / NOT GIVEN)',
    reading_mcq_single: 'Choose the correct letter A, B, C or D.',
    reading_mcq_multi: 'Choose TWO letters.',
    reading_summary_completion: 'Complete the summary.',
    reading_sentence_completion: 'Complete the sentences.',
    reading_short_answer: 'Answer the questions.',
    reading_matching_information: 'Which paragraph contains the following information?',
    reading_matching_features: 'Match each statement with the correct option.',
    reading_diagram_labelling: 'Complete the labels on the diagram.'
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
    confirmText: 'Submit reading',
    cancelText: 'Keep going',
    variant: 'info'
  })
  if (!ok) return
  const res: any = await $fetch('/api/attempts/submit', {
    method: 'POST',
    body: { test_id: testId, responses }
  })
  router.push(`/results/${res.attempt_id}`)
}
</script>
