<template>
  <div
    v-if="test"
    class="reading-exam-shell"
    :class="[`text-size-${textSize}`, { 'high-contrast': highContrast }]"
  >
    <header class="reading-topbar">
      <div class="reading-logo">IELTS</div>
      <div class="reading-candidate">
        <strong>Test taker ID</strong>
        <span>{{ test.title }}</span>
      </div>
      <div class="reading-status">
        <span class="reading-timer" :class="{ low: remaining <= 300 }">
          <Icon name="clock" :size="14" />
          {{ timeDisplay }}
        </span>
        <button class="inspera-icon-btn" title="Messages"><Icon name="bell" :size="22" /></button>
        <button class="inspera-icon-btn" title="Options" @click="optionsOpen = true"><Icon name="menu" :size="24" /></button>
      </div>
    </header>

    <section class="reading-split">
      <div class="reading-panel reading-passage">
        <h2>{{ currentSection?.title }}</h2>
        <p class="reading-instructions">{{ currentSection?.instructions }}</p>
        <div v-html="currentSection?.body"></div>
      </div>

      <div class="reading-panel reading-questions">
        <h2>Questions {{ sectionQuestionRange(currentSection) }}</h2>
        <template v-for="group in groupedQuestions(currentSection)" :key="group.type + group.from">
          <div class="qsection-title">
            Questions {{ group.from }}-{{ group.to }}: {{ typeLabel(group.type) }}
          </div>

          <div v-if="group.type === 'reading_matching_headings'" class="instructions reading-option-list">
            <strong>List of Headings</strong>
            <ol style="list-style-type: upper-roman;">
              <li v-for="h in group.items[0]?.data?.headings || []" :key="h.id">{{ h.text }}</li>
            </ol>
          </div>

          <div v-else-if="group.items[0]?.data?.options && optionListTypes.has(group.type)" class="instructions reading-option-list">
            <strong>{{ optionListTitle(group.type) }}</strong>
            <ol style="list-style-type: upper-alpha;">
              <li v-for="opt in group.items[0]?.data?.options || []" :key="opt.id || opt">
                {{ typeof opt === 'string' ? opt : opt.text }}
              </li>
            </ol>
          </div>

          <QuestionRenderer
            v-for="q in group.items"
            :key="q.id"
            :question="q"
            :model-value="responses[q.id]"
            @update="val => setResponse(q.id, val)"
          />
        </template>
      </div>
    </section>

    <div v-if="optionsOpen" class="options-page">
      <header>
        <h1>Options</h1>
        <button class="inspera-icon-btn" title="Close options" @click="optionsOpen = false"><Icon name="x" :size="26" /></button>
      </header>
      <main>
        <button class="option-row primary" @click="optionsOpen = false; submit()">
          <Icon name="send" :size="22" /> Go to submission page <Icon name="chevron-right" :size="22" />
        </button>
        <button class="option-row" @click="highContrast = !highContrast">
          <Icon name="contrast" :size="20" /> Contrast <strong>{{ highContrast ? 'On' : 'Off' }}</strong>
        </button>
        <div class="option-row option-row--stacked">
          <span class="option-row__label">
            <Icon name="zoom-in" :size="20" /> Text size <strong>{{ textSizeLabel }}</strong>
          </span>
          <div class="text-size-control" role="group" aria-label="Text size">
            <button
              v-for="choice in textSizeChoices"
              :key="choice.value"
              type="button"
              class="text-size-choice"
              :class="{ active: textSize === choice.value }"
              :aria-pressed="textSize === choice.value"
              @click="setTextSize(choice.value)"
            >
              <strong>{{ choice.mark }}</strong>
              <span>{{ choice.label }}</span>
            </button>
          </div>
        </div>
      </main>
    </div>

    <footer class="reading-bottombar">
      <div v-for="(s, si) in test.sections" :key="s.id" class="nav-group">
        <span class="label">Part {{ si + 1 }}</span>
        <button
          v-for="q in s.questions"
          :key="q.id"
          class="nav-btn"
          :class="{ answered: !!responses[q.id], current: currentSectionIndex === si }"
          @click="goTo(si)"
        >
          {{ q.number }}
        </button>
      </div>
      <div class="reading-footer-actions">
        <button class="btn secondary sm" :disabled="currentSectionIndex === 0" @click="goTo(currentSectionIndex - 1)">
          <Icon name="chevron-left" :size="14" /> Prev passage
        </button>
        <button class="btn sm" v-if="currentSectionIndex < (test.sections.length - 1)" @click="goTo(currentSectionIndex + 1)">
          Next passage <Icon name="chevron-right" :size="14" />
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
const optionsOpen = ref(false)
const highContrast = ref(false)
type TextSize = 'small' | 'medium' | 'large'
const textSize = ref<TextSize>('medium')
const textSizeChoices: Array<{ value: TextSize; mark: string; label: string }> = [
  { value: 'small', mark: 'A-', label: 'Lower' },
  { value: 'medium', mark: 'A', label: 'Middle' },
  { value: 'large', mark: 'A+', label: 'Higher' }
]
const textSizeLabel = computed(() => textSizeChoices.find(choice => choice.value === textSize.value)?.label || 'Middle')
const optionListTypes = new Set([
  'reading_matching_information',
  'reading_matching_features',
  'reading_matching_sentence_endings'
])

const duration = computed(() => (test.value?.duration_min || 60) * 60)
const remaining = ref(0)
let timer: ReturnType<typeof setInterval> | null = null
const timeDisplay = computed(() => {
  const s = Math.max(0, remaining.value)
  const m = Math.floor(s / 60), sec = s % 60
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
})

onMounted(() => {
  const savedTextSize = typeof window !== 'undefined' ? window.localStorage.getItem('ielts-reading-text-size') : null
  if (savedTextSize === 'small' || savedTextSize === 'medium' || savedTextSize === 'large') {
    textSize.value = savedTextSize
  }
  remaining.value = duration.value
  timer = setInterval(() => {
    remaining.value--
    if (remaining.value <= 0) {
      if (timer) clearInterval(timer)
      submit()
    }
  }, 1000)
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

function setResponse(qid: number, v: any) { responses[qid] = v }
function setTextSize(size: TextSize) {
  textSize.value = size
  if (typeof window !== 'undefined') window.localStorage.setItem('ielts-reading-text-size', size)
}
function goTo(si: number) {
  if (!test.value?.sections?.[si]) return
  currentSectionIndex.value = si
}

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
    if (!cur || cur.type !== q.type || q.data?.group_break) {
      cur = { type: q.type, from: q.number, to: q.number, items: [q] }
      groups.push(cur)
    } else {
      cur.items.push(q); cur.to = q.number
    }
  }
  return groups
}

function optionListTitle(type: string) {
  const map: Record<string, string> = {
    reading_matching_information: 'Reading passage sections',
    reading_matching_features: 'List of People',
    reading_matching_sentence_endings: 'List of Endings'
  }
  return map[type] || 'Options'
}

function typeLabel(t: string) {
  const map: Record<string,string> = {
    reading_matching_headings: 'Choose the correct heading for each paragraph.',
    reading_tfng: 'Do the statements agree with the information in the passage? TRUE / FALSE / NOT GIVEN.',
    reading_ynng: 'Do the statements agree with the views of the writer? YES / NO / NOT GIVEN.',
    reading_mcq_single: 'Choose the correct letter A, B, C or D.',
    reading_mcq_multi: 'Choose TWO letters.',
    reading_note_completion: 'Complete the notes below.',
    reading_table_completion: 'Complete the table below.',
    reading_flowchart_completion: 'Complete the flow-chart below.',
    reading_summary_completion: 'Complete the summary below.',
    reading_sentence_completion: 'Complete the sentences below.',
    reading_short_answer: 'Answer the questions below.',
    reading_matching_information: 'Which section contains the following information?',
    reading_matching_features: 'Match each statement with the correct option.',
    reading_matching_sentence_endings: 'Complete each sentence with the correct ending.',
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
