<!--
  Unified test editor. Accepts a test object with sections + questions,
  allows adding/editing/deleting sections and questions of any IELTS type.
-->
<template>
  <div class="test-editor">
    <!-- LOADING STATE -->
    <div v-if="loading" class="editor-skeleton">
      <div class="skeleton-head">
        <div class="skeleton-pill" />
        <div class="skeleton-title" />
      </div>
      <div class="skeleton-card" v-for="i in 2" :key="i" />
    </div>

    <!-- ERROR STATE -->
    <div v-else-if="err" class="card editor-error">
      <div class="editor-error__icon">
        <Icon name="alert-triangle" :size="28" />
      </div>
      <div style="flex:1;">
        <template v-if="errCode === 'SQLITE_CORRUPT'">
          <h2 style="margin:0 0 4px;">Your local database is corrupt</h2>
          <p class="text-muted" style="margin:0 0 10px;">
            SQLite reports <code>database disk image is malformed</code>. This usually happens
            when the dev server is killed mid-write or two seeds run at once. Nothing the admin
            UI does can fix this — the DB file has to be re-created.
          </p>
          <div class="recovery-steps">
            <div class="recovery-step"><span>1</span> Stop the dev server (<kbd>Ctrl</kbd>+<kbd>C</kbd> in its terminal).</div>
            <div class="recovery-step"><span>2</span> In the project folder run: <code>npm run reset-db</code></div>
            <div class="recovery-step"><span>3</span> Start it back up: <code>npm run dev</code></div>
            <div class="recovery-step"><span>4</span> Come back here and click <b>Retry</b>.</div>
          </div>
          <div class="row" style="gap:8px; margin-top:12px;">
            <button class="btn" @click="load">
              <Icon name="refresh-cw" :size="14" /> Retry
            </button>
            <NuxtLink to="/admin/tests" class="btn secondary">
              <Icon name="arrow-left" :size="14" /> Back to all tests
            </NuxtLink>
          </div>
        </template>
        <template v-else>
          <h2 style="margin:0 0 4px;">Couldn't load this test</h2>
          <p class="text-muted" style="margin:0 0 14px;">{{ err }}</p>
          <div class="row" style="gap:8px;">
            <button class="btn" @click="load">
              <Icon name="refresh-cw" :size="14" /> Retry
            </button>
            <NuxtLink to="/admin/tests" class="btn secondary">
              <Icon name="arrow-left" :size="14" /> Back to all tests
            </NuxtLink>
          </div>
        </template>
      </div>
    </div>

    <!-- LOADED STATE -->
    <template v-else-if="test">
      <!-- HEADER BANNER -->
      <div class="editor-banner" :class="`editor-banner--${test.skill}`">
        <div class="editor-banner__icon">
          <Icon :name="skillIcon" :size="22" />
        </div>
        <div style="flex:1; min-width:0;">
          <div class="row" style="gap:8px;">
            <span class="badge" :class="test.skill">{{ skillLabel }}</span>
            <span class="status-pill" :class="test.published ? 'ok' : 'draft'">
              <Icon :name="test.published ? 'check-circle' : 'edit'" :size="12" />
              {{ test.published ? 'Published' : 'Draft' }}
            </span>
          </div>
          <h1 style="margin:4px 0 0;">{{ test.title }}</h1>
          <p class="text-muted" style="margin:2px 0 0;">
            {{ test.sections?.length || 0 }} {{ sectionLabel.toLowerCase() }}{{ (test.sections?.length || 0) === 1 ? '' : 's' }}
            · {{ totalQuestions }} question{{ totalQuestions === 1 ? '' : 's' }}
            · {{ test.duration_min }} min
          </p>
        </div>
        <NuxtLink :to="`/admin/${test.skill}`" class="btn secondary">
          <Icon name="arrow-left" :size="14" /> Back to {{ test.skill }}
        </NuxtLink>
      </div>

      <!-- LISTENING HINT: audio-to-questions mapping -->
      <div v-if="isListening" class="banner info mt-4" style="align-items:flex-start;">
        <Icon name="info" :size="18" />
        <div>
          <strong>Each Part needs its own audio file.</strong>
          <div class="text-xs" style="margin-top:2px;">
            The audio you upload on a Part will play while students answer the questions listed inside that Part. Question numbering is global (1-40) across the four Parts.
            You can also bulk-manage uploads from
            <NuxtLink to="/admin/audio">Audio uploads</NuxtLink>.
          </div>
        </div>
      </div>

      <!-- SECTIONS LIST ---------------------------------------------------->
      <div v-for="section in test.sections" :key="section.id" class="section-card card mt-4">
        <header class="section-card__head">
          <div class="section-card__title">
            <span class="section-card__num">{{ section.order_index + 1 }}</span>
            <div style="min-width:0;">
              <h2 style="margin:0;">
                {{ sectionLabel }} {{ section.order_index + 1 }}
                <small class="text-muted" style="font-weight:500;">— {{ section.title || '(untitled)' }}</small>
              </h2>
              <p class="text-xs text-muted" style="margin:2px 0 0;">
                {{ questionRangeLabel(section) }} · {{ (section.questions || []).length }} question{{ (section.questions || []).length === 1 ? '' : 's' }}
                <template v-if="isListening">
                  · <span :class="section.audio_path ? 'pill-mini ok' : 'pill-mini warn'">
                      <Icon :name="section.audio_path ? 'check-circle' : 'alert-triangle'" :size="11" />
                      {{ section.audio_path ? 'Audio attached' : 'No audio' }}
                    </span>
                </template>
              </p>
            </div>
          </div>
          <div class="section-card__actions">
            <button class="btn secondary sm" @click="editingSection = editingSection === section.id ? null : section.id">
              <Icon :name="editingSection === section.id ? 'x-circle' : 'edit'" :size="13" />
              {{ editingSection === section.id ? 'Close' : 'Edit' }}
            </button>
            <button class="btn danger sm" @click="deleteSection(section.id)">
              <Icon name="trash" :size="13" /> Delete
            </button>
          </div>
        </header>

        <!-- SECTION EDITOR --------------------------------------------------->
        <div v-if="editingSection === section.id" class="admin-form section-card__editor">
          <div class="form-grid">
            <div>
              <label>Title</label>
              <input v-model="section.title" :placeholder="`e.g. ${defaultSectionTitle(section.order_index)}`" />
            </div>
            <div>
              <label>Instructions (shown above the questions)</label>
              <textarea v-model="section.instructions" rows="2"></textarea>
            </div>
          </div>

          <label>
            {{ isReading ? 'Passage text (HTML OK)' :
               isWriting ? 'Task prompt (HTML OK)' :
               isSpeaking ? 'Part intro / instructions' : 'Transcript (optional)' }}
          </label>
          <textarea v-model="section.body" rows="10"></textarea>

          <template v-if="isListening">
            <label>
              <Icon name="headphones" :size="13" /> Audio file for this Part
              <span class="text-xs text-muted"> — plays while students answer {{ questionRangeLabel(section) }}</span>
            </label>
            <input type="file" accept="audio/*" @change="uploadFile($event, section, 'audio')" />
            <div v-if="section.audio_path" class="audio-preview mt-2">
              <audio :src="section.audio_path" controls style="width:100%;"></audio>
              <div class="text-xs text-muted" style="margin-top:4px; word-break:break-all;">{{ section.audio_path }}</div>
            </div>
          </template>

          <template v-if="isListening || isWriting">
            <label>
              <Icon name="image" :size="13" /> Image (Writing Task 1 chart, Listening map/diagram)
            </label>
            <input type="file" accept="image/*" @change="uploadFile($event, section, 'image')" />
            <div v-if="section.image_path" class="mt-2">
              <img :src="section.image_path" style="max-width:260px; border:1px solid var(--border); border-radius:8px;"/>
              <div class="text-xs text-muted" style="margin-top:4px;">{{ section.image_path }}</div>
            </div>
          </template>

          <template v-if="isSpeaking && section.order_index === 1">
            <label>Cue card text (Part 2)</label>
            <textarea v-model="cueCardText" rows="5" placeholder="Describe a place you enjoy visiting. You should say: ..."></textarea>
          </template>

          <template v-if="isWriting">
            <label>Minimum words</label>
            <input type="number" v-model.number="minWords" />
          </template>

          <div class="row" style="margin-top:14px;">
            <button class="btn" @click="saveSection(section)" :disabled="savingSection === section.id">
              <Icon name="check-circle" :size="14" />
              {{ savingSection === section.id ? 'Saving…' : 'Save Section' }}
            </button>
            <button class="btn ghost sm" @click="editingSection = null">Cancel</button>
          </div>
        </div>

        <!-- QUESTIONS -------------------------------------------------------->
        <div class="section-card__questions">
          <div v-if="!(section.questions || []).length" class="empty sm">
            <Icon name="file-text" :size="22" />
            <p style="margin:6px 0 0;">No questions yet in this {{ sectionLabel.toLowerCase() }}.</p>
            <button class="btn cta mt-3" @click="addQuestion(section)">
              <Icon name="plus" :size="14" /> Add first question
            </button>
          </div>
          <table v-else class="admin-table polished">
            <thead>
              <tr>
                <th style="width:56px;">#</th>
                <th style="width:200px;">Type</th>
                <th>Prompt</th>
                <th style="width:220px;">Answer</th>
                <th style="width:110px;"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="q in section.questions" :key="q.id">
                <td><strong>{{ q.number }}</strong></td>
                <td><span class="type-chip">{{ formatType(q.type) }}</span></td>
                <td style="max-width:400px;">
                  <div class="prompt-cell">{{ stripHtml(q.prompt) }}</div>
                </td>
                <td><code class="ans-chip">{{ formatAnswer(q.answer) }}</code></td>
                <td style="text-align:right;">
                  <button class="icon-btn" title="Edit question" @click="editQuestion(q, section)">
                    <Icon name="edit" :size="14" />
                  </button>
                  <button class="icon-btn danger" title="Delete question" @click="deleteQuestion(q.id)">
                    <Icon name="trash" :size="14" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="(section.questions || []).length" style="padding:12px 18px;">
            <button class="btn secondary sm" @click="addQuestion(section)">
              <Icon name="plus" :size="13" /> Add question
            </button>
          </div>
        </div>
      </div>

      <div class="add-section-row mt-4">
        <button class="btn cta" @click="addSection">
          <Icon name="plus" :size="15" /> Add {{ sectionLabel }}
        </button>
      </div>

      <!-- QUESTION EDITOR MODAL ------------------------------------------------>
      <Teleport to="body">
        <div v-if="editQ" class="qe-backdrop" @click.self="editQ = null">
          <div class="qe-panel card">
            <header class="qe-header">
              <div class="row" style="gap:10px;">
                <span class="editor-banner__icon" style="width:36px; height:36px;">
                  <Icon :name="editQ.id ? 'edit' : 'plus'" :size="16" />
                </span>
                <div>
                  <h2 style="margin:0;">{{ editQ.id ? 'Edit question' : 'Add question' }}</h2>
                  <p class="text-xs text-muted" style="margin:0;">Question #{{ editQ.number }}</p>
                </div>
              </div>
              <button class="icon-btn" @click="editQ = null" title="Close">
                <Icon name="x-circle" :size="18" />
              </button>
            </header>

            <div class="admin-form qe-body">
              <div class="form-grid">
                <div>
                  <label>Type</label>
                  <select v-model="editQ.type">
                    <optgroup v-for="group in typesForSkill" :key="group.label" :label="group.label">
                      <option v-for="t in group.types" :key="t.value" :value="t.value">{{ t.label }}</option>
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label>Question number (1-40)</label>
                  <input type="number" v-model.number="editQ.number" />
                </div>
              </div>

              <label>Prompt / stem (HTML OK)</label>
              <textarea v-model="editQ.prompt" rows="3"></textarea>

              <!-- Type-specific fields ------------------------------------------->
              <template v-if="editQ.type?.endsWith('mcq_single') || editQ.type?.endsWith('mcq_multi')">
                <label>Options (one per line)</label>
                <textarea v-model="optionsText" rows="5" placeholder="First option&#10;Second option&#10;..."></textarea>
                <div v-if="editQ.type?.endsWith('mcq_multi')" class="form-grid">
                  <div>
                    <label>How many to choose?</label>
                    <input type="number" v-model.number="chooseCount" />
                  </div>
                  <div>
                    <label>Correct letters (e.g. A,B)</label>
                    <input v-model="answerText" />
                  </div>
                </div>
                <template v-else>
                  <label>Correct letter (e.g. A)</label>
                  <input v-model="answerText" />
                </template>
              </template>

              <template v-else-if="editQ.type === 'reading_matching_headings'">
                <label>Headings list (one per line, format: <code>i=Heading text</code>)</label>
                <textarea v-model="headingsText" rows="8" placeholder="i=The origins of the bridge&#10;ii=Economic impact&#10;..."></textarea>
                <label>Correct heading ID (e.g. iii)</label>
                <input v-model="answerText" />
              </template>

              <template v-else-if="editQ.type?.includes('matching')">
                <label>Options (one per line, format: <code>A=Option text</code>)</label>
                <textarea v-model="optionsText" rows="6" placeholder="A=Scientist X&#10;B=Scientist Y&#10;..."></textarea>
                <label class="check-row">
                  <input type="checkbox" v-model="dragDropInteraction" />
                  Use Inspera-style drag/drop answer cards
                </label>
                <label>Correct option letter</label>
                <input v-model="answerText" />
              </template>

              <template v-else-if="editQ.type === 'reading_tfng' || editQ.type === 'listening_mcq_single'">
                <label>Correct answer</label>
                <input v-model="answerText" placeholder="TRUE / FALSE / NOT GIVEN or A/B/C" />
              </template>

              <template v-else-if="editQ.type === 'reading_ynng'">
                <label>Correct answer</label>
                <input v-model="answerText" placeholder="YES / NO / NOT GIVEN" />
              </template>

              <template v-else-if="editQ.type?.includes('completion') || editQ.type?.includes('short_answer') || editQ.type?.includes('labelling')">
                <div class="form-grid">
                  <div>
                    <label>Word limit</label>
                    <input type="number" v-model.number="wordLimit" placeholder="e.g. 2" />
                  </div>
                  <div>
                    <label>Correct answer (use <code>|</code> for alternatives)</label>
                    <input v-model="answerText" placeholder="elephant|elephants" />
                  </div>
                </div>
                <label>Word bank / draggable choices (optional, one per line)</label>
                <textarea v-model="wordBankText" rows="4" placeholder="puzzle&#10;logic&#10;confusion"></textarea>
              </template>

              <template v-else-if="editQ.type?.startsWith('writing_')">
                <label>Minimum words</label>
                <input type="number" v-model.number="minWordsQ" />
                <div class="banner info">
                  <Icon name="info" :size="16" />
                  <span>Writing tasks are not auto-scored — examiners grade manually.</span>
                </div>
              </template>

              <template v-else-if="editQ.type?.startsWith('speaking_')">
                <label>Cue card text (Part 2 only)</label>
                <textarea v-model="cueCardQ" rows="4"></textarea>
                <div class="banner info">
                  <Icon name="info" :size="16" />
                  <span>Speaking responses are recorded as audio and not auto-scored.</span>
                </div>
              </template>

              <label>Points</label>
              <input type="number" v-model.number="editQ.points" />
            </div>

            <footer class="qe-footer">
              <button class="btn ghost" @click="editQ = null">Cancel</button>
              <button class="btn" @click="saveQuestion" :disabled="savingQuestion">
                <Icon name="check-circle" :size="14" />
                {{ savingQuestion ? 'Saving…' : 'Save question' }}
              </button>
            </footer>
          </div>
        </div>
      </Teleport>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ testId: number }>()
const modal = useModal()
const toast = useToast()

const test = ref<any>(null)
const loading = ref(true)
const err = ref('')
const errCode = ref('')
const editingSection = ref<number | null>(null)
const savingSection = ref<number | null>(null)
const savingQuestion = ref(false)
const editQ = ref<any>(null)
const currentSection = ref<any>(null)

// helper refs bound to forms
const optionsText = ref('')
const headingsText = ref('')
const answerText = ref('')
const wordBankText = ref('')
const dragDropInteraction = ref(false)
const chooseCount = ref(2)
const wordLimit = ref(2)
const minWordsQ = ref(150)
const minWords = ref(150)
const cueCardText = ref('')
const cueCardQ = ref('')

const isReading = computed(() => test.value?.skill === 'reading')
const isListening = computed(() => test.value?.skill === 'listening')
const isWriting = computed(() => test.value?.skill === 'writing')
const isSpeaking = computed(() => test.value?.skill === 'speaking')
const sectionLabel = computed(() =>
  isReading.value ? 'Passage' : isListening.value ? 'Part' : isWriting.value ? 'Task' : 'Part'
)
const skillLabel = computed(() => {
  const s = test.value?.skill
  return s ? s[0].toUpperCase() + s.slice(1) : ''
})
const skillIcon = computed(() => ({
  reading: 'book-open',
  listening: 'headphones',
  writing: 'pen-tool',
  speaking: 'mic'
} as Record<string, string>)[test.value?.skill] || 'file-text')

const totalQuestions = computed(() =>
  (test.value?.sections || []).reduce((n: number, s: any) => n + (s.questions?.length || 0), 0)
)

function questionRangeLabel(section: any): string {
  const qs = section.questions || []
  if (!qs.length) return 'No questions'
  const nums = qs.map((q: any) => q.number).filter((n: number) => Number.isFinite(n))
  if (!nums.length) return 'No questions'
  const lo = Math.min(...nums), hi = Math.max(...nums)
  return lo === hi ? `Question ${lo}` : `Questions ${lo}–${hi}`
}

function defaultSectionTitle(i: number) {
  if (isReading.value) return `Passage ${i + 1}`
  if (isListening.value) return `Part ${i + 1}`
  if (isWriting.value) return `Task ${i + 1}`
  return `Part ${i + 1}`
}

const typesForSkill = computed(() => {
  const all: Record<string, any[]> = {
    reading: [
      { label: 'Reading', types: [
        { value:'reading_matching_headings', label:'Matching Headings' },
        { value:'reading_tfng', label:'True/False/Not Given' },
        { value:'reading_ynng', label:'Yes/No/Not Given' },
        { value:'reading_mcq_single', label:'Multiple Choice (single)' },
        { value:'reading_mcq_multi', label:'Multiple Choice (multi)' },
        { value:'reading_summary_completion', label:'Summary Completion' },
        { value:'reading_sentence_completion', label:'Sentence Completion' },
        { value:'reading_note_completion', label:'Note Completion' },
        { value:'reading_table_completion', label:'Table Completion' },
        { value:'reading_flowchart_completion', label:'Flow-chart Completion' },
        { value:'reading_short_answer', label:'Short Answer' },
        { value:'reading_matching_information', label:'Matching Information' },
        { value:'reading_matching_features', label:'Matching Features' },
        { value:'reading_matching_sentence_endings', label:'Matching Sentence Endings' },
        { value:'reading_diagram_labelling', label:'Diagram Labelling' },
      ]}
    ],
    listening: [
      { label: 'Listening', types: [
        { value:'listening_form_completion', label:'Form Completion' },
        { value:'listening_note_completion', label:'Note Completion' },
        { value:'listening_table_completion', label:'Table Completion' },
        { value:'listening_flowchart_completion', label:'Flow-chart Completion' },
        { value:'listening_summary_completion', label:'Summary Completion' },
        { value:'listening_sentence_completion', label:'Sentence Completion' },
        { value:'listening_mcq_single', label:'Multiple Choice (single)' },
        { value:'listening_mcq_multi', label:'Multiple Choice (multi)' },
        { value:'listening_matching', label:'Matching' },
        { value:'listening_map_labelling', label:'Map/Plan/Diagram Labelling' },
        { value:'listening_short_answer', label:'Short Answer' },
      ]}
    ],
    writing: [ { label:'Writing', types: [
      { value:'writing_task_1', label:'Task 1' },
      { value:'writing_task_2', label:'Task 2' },
    ]}],
    speaking: [ { label:'Speaking', types: [
      { value:'speaking_part_1', label:'Part 1' },
      { value:'speaking_part_2', label:'Part 2 (cue card)' },
      { value:'speaking_part_3', label:'Part 3' },
    ]}]
  }
  return all[test.value?.skill] || []
})

async function load() {
  loading.value = true
  err.value = ''
  errCode.value = ''
  try {
    test.value = await $fetch(`/api/admin/tests/${props.testId}`)
  } catch (e: any) {
    err.value = e?.statusMessage || e?.data?.statusMessage || e?.message || 'Failed to load test.'
    errCode.value = e?.data?.code || e?.statusCode?.toString() || ''
    if (e?.statusCode === 401) {
      toast.error('Session expired — please sign in again')
      await navigateTo('/admin/login')
      return
    }
    // Detect the DB-corrupt case so the UI can show a dedicated recovery card.
    const msg = String(err.value).toLowerCase()
    if (msg.includes('corrupt') || msg.includes('malformed') || msg.includes('reset-db')) {
      errCode.value = 'SQLITE_CORRUPT'
    }
  } finally {
    loading.value = false
  }
}
onMounted(load)

function stripHtml(s: any) { return String(s||'').replace(/<[^>]+>/g, '').slice(0, 150) }
function formatAnswer(a: any) {
  if (a == null) return '—'
  if (typeof a === 'object') {
    const v = a?.answer ?? a
    if (Array.isArray(v)) return v.join(', ')
    return JSON.stringify(v)
  }
  return String(a)
}
function formatType(t: string) {
  return String(t || '').split('_').slice(1).join(' ').replace(/\b\w/g, c => c.toUpperCase()) || t
}

async function addSection() {
  const s: any = { test_id: props.testId, title: '', instructions: '', body: '' }
  if (test.value?.skill === 'writing') s.extra = { min_words: 150, suggested_min: 20 }
  try {
    await $fetch('/api/admin/sections', { method: 'POST', body: s })
    toast.success(`${sectionLabel.value} added`)
    await load()
  } catch (e: any) {
    toast.error(e?.statusMessage || 'Failed to add section')
  }
}

async function deleteSection(id: number) {
  const ok = await modal.confirm({
    title: 'Delete this section?',
    message: 'This will remove the section and every question inside it. This cannot be undone.',
    confirmText: 'Delete section',
    variant: 'danger',
    danger: true
  })
  if (!ok) return
  try {
    await $fetch(`/api/admin/sections/${id}`, { method: 'DELETE' })
    toast.success('Section deleted')
    await load()
  } catch (e: any) {
    toast.error(e?.statusMessage || 'Failed to delete section')
  }
}

async function saveSection(section: any) {
  savingSection.value = section.id
  const body: any = {
    title: section.title, instructions: section.instructions, body: section.body,
    audio_path: section.audio_path, image_path: section.image_path
  }
  const extra: any = section.extra || {}
  if (minWords.value) extra.min_words = minWords.value
  if (cueCardText.value) extra.cue_card = cueCardText.value
  body.extra = extra
  try {
    await $fetch(`/api/admin/sections/${section.id}`, { method: 'PUT', body })
    toast.success('Section saved')
    editingSection.value = null
    await load()
  } catch (e: any) {
    toast.error(e?.statusMessage || 'Failed to save section')
  } finally {
    savingSection.value = null
  }
}

async function uploadFile(e: Event, section: any, kind: 'audio'|'image') {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    const fd = new FormData()
    fd.append('kind', kind); fd.append('file', file)
    const res: any = await $fetch('/api/admin/upload', { method: 'POST', body: fd })
    if (kind === 'audio') section.audio_path = res.path
    else section.image_path = res.path
    await $fetch(`/api/admin/sections/${section.id}`, { method: 'PUT', body: {
      audio_path: section.audio_path, image_path: section.image_path
    }})
    toast.success(`${kind === 'audio' ? 'Audio' : 'Image'} uploaded`)
  } catch (e: any) {
    toast.error(e?.statusMessage || `${kind} upload failed`)
  } finally {
    input.value = ''
  }
}

function addQuestion(section: any) {
  currentSection.value = section
  editQ.value = {
    section_id: section.id,
    type: typesForSkill.value[0]?.types[0]?.value,
    number: (section.questions?.[section.questions.length-1]?.number || 0) + 1,
    order_index: section.questions?.length || 0,
    points: 1, prompt: '', data: {}, answer: null
  }
  optionsText.value = ''; headingsText.value = ''; answerText.value = ''; wordBankText.value = ''
  dragDropInteraction.value = false
  chooseCount.value = 2; wordLimit.value = 2; minWordsQ.value = 150; cueCardQ.value = ''
}

function editQuestion(q: any, section: any) {
  currentSection.value = section
  editQ.value = JSON.parse(JSON.stringify(q))
  // hydrate helper refs
  const t = q.type || ''
  if (t.endsWith('mcq_single') || t.endsWith('mcq_multi')) {
    optionsText.value = (q.data?.options || []).join('\n')
    chooseCount.value = q.data?.choose || 2
    answerText.value = Array.isArray(q.answer?.answer) ? q.answer.answer.join(',') : (q.answer?.answer ?? q.answer ?? '')
  } else if (t === 'reading_matching_headings') {
    headingsText.value = (q.data?.headings || []).map((h:any) => `${h.id}=${h.text}`).join('\n')
    answerText.value = q.answer?.answer ?? q.answer ?? ''
  } else if (t.includes('matching')) {
    optionsText.value = (q.data?.options || []).map((o:any) => `${o.id}=${o.text}`).join('\n')
    dragDropInteraction.value = q.data?.interaction === 'drag_drop'
    answerText.value = q.answer?.answer ?? q.answer ?? ''
  } else if (t.includes('completion') || t.includes('short_answer') || t.includes('labelling')) {
    wordLimit.value = q.data?.word_limit ?? 2
    wordBankText.value = (q.data?.word_bank || []).join('\n')
    answerText.value = Array.isArray(q.answer?.answer) ? q.answer.answer.join('|') : (q.answer?.answer ?? q.answer ?? '')
  } else {
    answerText.value = q.answer?.answer ?? q.answer ?? ''
  }
  if (t.startsWith('writing_')) minWordsQ.value = q.data?.min_words ?? 150
  if (t.startsWith('speaking_')) cueCardQ.value = q.data?.cue_card ?? ''
}

function parseHeadings(text: string) {
  return text.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const [id, ...rest] = l.split('=')
    return { id: id.trim(), text: rest.join('=').trim() }
  })
}
function parseOptions(text: string) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  // If lines contain "X=..." treat as matching options, else treat as MCQ plain list
  if (lines.every(l => /^[A-Z]=/.test(l))) {
    return lines.map(l => { const [id, ...r] = l.split('='); return { id: id.trim(), text: r.join('=').trim() } })
  }
  return lines
}

async function saveQuestion() {
  const q = editQ.value
  const t = q.type
  savingQuestion.value = true
  // Build data + answer from helper refs
  q.data = q.data || {}
  if (t.endsWith('mcq_single') || t.endsWith('mcq_multi')) {
    q.data.options = parseOptions(optionsText.value)
    if (t.endsWith('mcq_multi')) q.data.choose = chooseCount.value
    q.answer = { answer: t.endsWith('mcq_multi') ? answerText.value.split(',').map(s=>s.trim().toUpperCase()) : answerText.value.trim().toUpperCase() }
  } else if (t === 'reading_matching_headings') {
    q.data.headings = parseHeadings(headingsText.value)
    q.answer = { answer: answerText.value.trim() }
  } else if (t.includes('matching')) {
    q.data.options = parseOptions(optionsText.value)
    if (dragDropInteraction.value) q.data.interaction = 'drag_drop'
    else delete q.data.interaction
    q.answer = { answer: answerText.value.trim().toUpperCase() }
  } else if (t.includes('completion') || t.includes('short_answer') || t.includes('labelling')) {
    q.data.word_limit = wordLimit.value
    q.data.word_bank = wordBankText.value.split('\n').map(s => s.trim()).filter(Boolean)
    const alts = answerText.value.split('|').map(s => s.trim()).filter(Boolean)
    q.answer = { answer: alts.length > 1 ? alts : alts[0] }
  } else if (t === 'reading_tfng' || t === 'reading_ynng') {
    q.answer = { answer: answerText.value.trim().toUpperCase() }
  } else if (t.startsWith('writing_')) {
    q.data.min_words = minWordsQ.value
    q.answer = null
  } else if (t.startsWith('speaking_')) {
    if (cueCardQ.value) q.data.cue_card = cueCardQ.value
    q.answer = null
  } else {
    q.answer = { answer: answerText.value.trim() }
  }

  try {
    if (q.id) {
      await $fetch(`/api/admin/questions/${q.id}`, { method: 'PUT', body: q })
    } else {
      await $fetch('/api/admin/questions', { method: 'POST', body: q })
    }
    toast.success(q.id ? 'Question saved' : 'Question added')
    editQ.value = null
    await load()
  } catch (e: any) {
    toast.error(e?.statusMessage || 'Failed to save question')
  } finally {
    savingQuestion.value = false
  }
}

async function deleteQuestion(id: number) {
  const ok = await modal.confirm({
    title: 'Delete this question?',
    message: 'The question and its saved answer will be removed from this section.',
    confirmText: 'Delete question',
    variant: 'danger',
    danger: true
  })
  if (!ok) return
  try {
    await $fetch(`/api/admin/questions/${id}`, { method: 'DELETE' })
    toast.success('Question deleted')
    await load()
  } catch (e: any) {
    toast.error(e?.statusMessage || 'Failed to delete')
  }
}
</script>

<style scoped>
.test-editor { display: block; }
.check-row {
  display: inline-flex !important;
  align-items: center;
  gap: 8px;
  margin: 8px 0 12px;
  font-weight: 600;
  color: var(--text-strong);
}
.check-row input {
  width: auto;
}

/* Loading skeleton */
.editor-skeleton { display: flex; flex-direction: column; gap: 16px; }
.skeleton-head { display: flex; gap: 16px; align-items: center; }
.skeleton-pill {
  width: 120px; height: 22px; border-radius: 999px;
  background: linear-gradient(90deg, var(--surface-2), #edf2f7, var(--surface-2));
  background-size: 200% 100%; animation: shimmer 1.4s infinite;
}
.skeleton-title {
  flex: 1; height: 30px; border-radius: 10px;
  background: linear-gradient(90deg, var(--surface-2), #edf2f7, var(--surface-2));
  background-size: 200% 100%; animation: shimmer 1.4s infinite;
}
.skeleton-card {
  height: 180px; border-radius: var(--radius-lg);
  background: linear-gradient(90deg, var(--surface-2), #edf2f7, var(--surface-2));
  background-size: 200% 100%; animation: shimmer 1.4s infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Error state */
.editor-error {
  display: flex; gap: 16px; align-items: flex-start;
  padding: 22px;
  border-left: 4px solid var(--err, #E11D48);
}
.editor-error__icon {
  width: 48px; height: 48px; border-radius: 12px;
  display: inline-flex; align-items: center; justify-content: center;
  background: rgba(225, 29, 72, 0.1); color: #B91C1C;
  flex-shrink: 0;
}

/* Header banner */
.editor-banner {
  display: flex; gap: 16px; align-items: center;
  padding: 22px 24px;
  border-radius: var(--radius-lg);
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  flex-wrap: wrap;
}
.editor-banner__icon {
  width: 48px; height: 48px; border-radius: 14px;
  display: inline-flex; align-items: center; justify-content: center;
  color: #fff;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  box-shadow: 0 8px 18px -8px rgba(14, 165, 233, 0.6);
  flex-shrink: 0;
}
.editor-banner--reading .editor-banner__icon { background: linear-gradient(135deg, #0ea5e9, #6366f1); }
.editor-banner--listening .editor-banner__icon { background: linear-gradient(135deg, #8b5cf6, #ec4899); }
.editor-banner--writing .editor-banner__icon { background: linear-gradient(135deg, #f59e0b, #ef4444); }
.editor-banner--speaking .editor-banner__icon { background: linear-gradient(135deg, #10b981, #14b8a6); }

/* Section cards */
.section-card { padding: 0; overflow: hidden; }
.section-card__head {
  display: flex; justify-content: space-between; align-items: flex-start;
  gap: 14px; padding: 18px 22px;
  background: linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%);
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}
.section-card__title { display: flex; gap: 14px; align-items: flex-start; flex: 1; min-width: 0; }
.section-card__num {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: #fff; font-weight: 800;
  display: inline-flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 14px -6px rgba(14, 165, 233, 0.6);
  flex-shrink: 0;
}
.section-card__actions { display: flex; gap: 6px; }
.section-card__editor { padding: 18px 22px; background: var(--surface); border-bottom: 1px solid var(--border); }
.section-card__questions { padding: 0; }

.form-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
}
@media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }

.audio-preview {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px;
}

/* Polished table */
.admin-table.polished {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
}
.admin-table.polished thead th {
  background: var(--surface-2);
  color: var(--text-muted, #64748b);
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 10px 18px;
  text-align: left;
  border-bottom: 1px solid var(--border);
}
.admin-table.polished tbody td {
  padding: 12px 18px;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}
.admin-table.polished tbody tr:hover { background: var(--surface-2); }
.admin-table.polished tbody tr:last-child td { border-bottom: none; }

.type-chip {
  display: inline-flex; padding: 2px 10px;
  font-size: 12px; font-weight: 600;
  color: var(--primary-700); background: var(--primary-50);
  border-radius: 999px;
}
.ans-chip {
  display: inline-block;
  font-size: 12px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 2px 8px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.prompt-cell {
  max-height: 60px; overflow: auto;
  font-size: 14px; line-height: 1.4;
  color: #334155;
}

.icon-btn {
  width: 30px; height: 30px;
  display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid var(--border);
  background: #fff; border-radius: 8px;
  color: var(--text-muted, #64748b);
  cursor: pointer;
  transition: all 150ms ease;
  margin-left: 4px;
}
.icon-btn:hover { border-color: var(--primary); color: var(--primary-700); }
.icon-btn.danger:hover { border-color: #FCA5A5; color: #B91C1C; background: #FEF2F2; }

.status-pill {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}
.status-pill.ok { background: rgba(16, 185, 129, 0.12); color: #047857; }
.status-pill.draft { background: rgba(251, 191, 36, 0.15); color: #92400E; }

.pill-mini {
  display: inline-flex; align-items: center; gap: 3px;
  padding: 1px 7px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 11px;
}
.pill-mini.ok { background: rgba(16, 185, 129, 0.12); color: #047857; }
.pill-mini.warn { background: rgba(251, 191, 36, 0.18); color: #92400E; }

.empty.sm { padding: 24px; }

.add-section-row {
  display: flex; justify-content: center;
  padding: 10px 0;
}

/* Question editor modal */
.qe-backdrop {
  position: fixed; inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  display: flex; align-items: flex-start; justify-content: center;
  padding: 40px 16px;
  z-index: 100;
  overflow-y: auto;
}
.qe-panel {
  width: 100%; max-width: 620px;
  padding: 0;
  max-height: calc(100vh - 80px);
  display: flex; flex-direction: column;
  box-shadow: 0 30px 80px -20px rgba(15, 23, 42, 0.35);
}
.qe-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px 22px;
  border-bottom: 1px solid var(--border);
}
.qe-body { padding: 18px 22px; overflow-y: auto; flex: 1; }
.qe-footer {
  display: flex; justify-content: flex-end; gap: 8px;
  padding: 14px 22px;
  border-top: 1px solid var(--border);
  background: var(--surface-2);
}
</style>
