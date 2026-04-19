<template>
  <div class="audio-page">
    <header class="audio-head">
      <div class="audio-head__left">
        <span class="audio-head__icon">
          <Icon name="headphones" :size="22" />
        </span>
        <div>
          <h1 style="margin:0;">Audio uploads</h1>
          <p class="text-muted" style="margin:4px 0 0;">
            Upload one audio file per Listening Part. The audio plays while students answer the question range shown on each tile.
          </p>
        </div>
      </div>
      <div class="row" style="gap:8px;">
        <button class="btn secondary sm" @click="loadAll" :disabled="loading">
          <Icon name="refresh-cw" :size="14" />
          {{ loading ? 'Refreshing…' : 'Refresh' }}
        </button>
      </div>
    </header>

    <!-- Mapping explainer -->
    <div class="banner info mt-4" style="align-items:flex-start;">
      <Icon name="info" :size="18" />
      <div>
        <strong>How audio maps to questions</strong>
        <div class="text-xs" style="margin-top:4px; line-height:1.55;">
          Each Listening test has four Parts. Questions are numbered <b>1–40</b> globally across all four Parts (e.g. Part 1 usually = Qs 1–10, Part 2 = 11–20, Part 3 = 21–30, Part 4 = 31–40). The audio you attach on a Part will play automatically only while students are on that Part's questions. Upload the correct Part's audio by matching the <b>question range</b> shown on each tile.
        </div>
      </div>
    </div>

    <!-- Summary bar -->
    <div v-if="!loading && listeningTests.length" class="summary-bar mt-4">
      <div class="summary-stat">
        <Icon name="file-text" :size="18" />
        <div>
          <div class="summary-stat__num">{{ listeningTests.length }}</div>
          <div class="summary-stat__label">Listening test{{ listeningTests.length === 1 ? '' : 's' }}</div>
        </div>
      </div>
      <div class="summary-stat">
        <Icon name="check-circle" :size="18" />
        <div>
          <div class="summary-stat__num">{{ partsWithAudio }} / {{ totalParts }}</div>
          <div class="summary-stat__label">Parts with audio attached</div>
        </div>
      </div>
      <div class="summary-stat" :class="{ 'summary-stat--warn': partsWithoutAudio > 0 }">
        <Icon :name="partsWithoutAudio > 0 ? 'alert-triangle' : 'check-circle'" :size="18" />
        <div>
          <div class="summary-stat__num">{{ partsWithoutAudio }}</div>
          <div class="summary-stat__label">Still need audio</div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="empty mt-4">
      <Icon name="loader" :size="26" />
      <p style="margin:8px 0 0;">Loading listening tests…</p>
    </div>

    <!-- DB-corrupt recovery card -->
    <div v-else-if="loadErrCode === 'SQLITE_CORRUPT'" class="recover-card mt-4">
      <div class="recover-card__head">
        <span class="recover-card__icon">
          <Icon name="alert-triangle" :size="22" />
        </span>
        <div>
          <h3 style="margin:0;">Your local database needs a reset</h3>
          <p class="text-xs" style="margin:4px 0 0; color:var(--muted);">
            SQLite detected corruption ("database disk image is malformed"). Uploads and editing are paused until the database is rebuilt. The fix takes about 15 seconds.
          </p>
        </div>
      </div>

      <ol class="recover-steps">
        <li>
          <span class="recover-steps__num">1</span>
          <div>
            <strong>Stop the dev server</strong>
            <p class="text-xs text-muted" style="margin:2px 0 0;">Press <kbd>Ctrl</kbd> + <kbd>C</kbd> in the terminal where <code>npm run dev</code> is running.</p>
          </div>
        </li>
        <li>
          <span class="recover-steps__num">2</span>
          <div>
            <strong>In that same folder, run:</strong>
            <pre class="recover-cmd">npm run reset-db</pre>
            <p class="text-xs text-muted" style="margin:2px 0 0;">This wipes <code>data/ielts.sqlite</code> and re-seeds the Cambridge-style mock.</p>
          </div>
        </li>
        <li>
          <span class="recover-steps__num">3</span>
          <div>
            <strong>Start the server again:</strong>
            <pre class="recover-cmd">npm run dev</pre>
          </div>
        </li>
        <li>
          <span class="recover-steps__num">4</span>
          <div>
            <strong>Come back here and click Retry.</strong>
            <p class="text-xs text-muted" style="margin:2px 0 0;">Your uploaded audio files in <code>public/uploads/audio/</code> are untouched — you may just need to re-attach them to the Parts.</p>
          </div>
        </li>
      </ol>

      <div class="row" style="gap:8px; margin-top:12px;">
        <button class="btn primary sm" @click="loadAll">
          <Icon name="refresh-cw" :size="14" /> Retry
        </button>
        <span class="text-xs text-muted">Raw error: <code>{{ loadErr }}</code></span>
      </div>
    </div>

    <!-- Generic error -->
    <div v-else-if="loadErr" class="banner err mt-4">
      <Icon name="x-circle" :size="18" />
      <div style="flex:1;">
        <strong>Couldn't load listening tests.</strong>
        <div class="text-xs">{{ loadErr }}</div>
      </div>
      <button class="btn ghost sm" @click="loadAll">
        <Icon name="refresh-cw" :size="14" /> Retry
      </button>
    </div>

    <!-- Empty -->
    <div v-else-if="!listeningTests.length" class="empty mt-4">
      <Icon name="headphones" :size="28" />
      <p style="margin:8px 0 0;">No listening tests yet — run <code>npm run seed</code> to seed the Cambridge-style mock.</p>
    </div>

    <!-- Tests -->
    <section v-for="test in listeningTests" :key="test.id" class="card mt-4 test-card">
      <header class="test-card__head">
        <div class="row" style="gap:12px;">
          <span class="test-card__num">#{{ test.id }}</span>
          <div>
            <div class="row" style="gap:8px;">
              <span class="badge listening">Listening</span>
              <span class="status-pill" :class="partsUploaded(test) === (test.sections || []).length ? 'ok' : 'partial'">
                <Icon :name="partsUploaded(test) === (test.sections || []).length ? 'check-circle' : 'alert-triangle'" :size="12" />
                {{ partsUploaded(test) }} / {{ (test.sections || []).length }} audio files
              </span>
            </div>
            <h3 style="margin:4px 0 0;">{{ test.title }}</h3>
          </div>
        </div>
        <NuxtLink :to="`/admin/listening/${test.id}`" class="btn secondary sm">
          <Icon name="edit" :size="14" /> Edit questions
        </NuxtLink>
      </header>

      <div class="parts-grid">
        <div
          v-for="part in sortedSections(test)"
          :key="part.id"
          class="part-tile"
          :class="{ 'part-tile--missing': !part.audio_path }"
        >
          <div class="part-tile__head">
            <span class="part-tile__num">{{ part.order_index + 1 }}</span>
            <div style="flex:1; min-width:0;">
              <h4 style="margin:0;">Part {{ part.order_index + 1 }}</h4>
              <p class="text-xs text-muted" style="margin:1px 0 0;">
                {{ part.title || defaultPartTitle(part.order_index) }}
              </p>
            </div>
          </div>

          <div class="part-tile__meta">
            <div class="part-tile__range">
              <Icon name="file-text" :size="13" />
              <span>{{ questionRange(part) }}</span>
            </div>
            <div class="part-tile__count">
              {{ (part.questions || []).length }} question{{ (part.questions || []).length === 1 ? '' : 's' }}
            </div>
          </div>

          <div class="part-tile__status">
            <template v-if="part.audio_path">
              <div class="status-row ok">
                <Icon name="check-circle" :size="14" />
                <span>Audio attached</span>
              </div>
              <audio :src="part.audio_path" controls preload="none" class="audio-player" />
              <div class="text-xs text-muted file-path" :title="part.audio_path">
                <Icon name="file-text" :size="11" />
                <span>{{ shortPath(part.audio_path) }}</span>
              </div>
            </template>
            <template v-else>
              <div class="status-row warn">
                <Icon name="alert-triangle" :size="14" />
                <span>No audio yet — students won't hear this part.</span>
              </div>
            </template>
          </div>

          <label class="audio-drop" :class="{ 'audio-drop--busy': uploading[part.id] }">
            <Icon :name="uploading[part.id] ? 'loader' : (part.audio_path ? 'refresh-cw' : 'upload')" :size="20" />
            <div class="audio-drop__label">
              {{ uploading[part.id]
                ? 'Uploading…'
                : (part.audio_path ? `Replace audio for Part ${part.order_index + 1}` : `Upload audio for Part ${part.order_index + 1}`) }}
            </div>
            <div class="text-xs text-muted">MP3 or WAV · max ~50 MB · plays during {{ questionRange(part) }}</div>
            <input
              type="file"
              accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav,.mp3,.wav"
              style="display:none;"
              :disabled="uploading[part.id]"
              @change="(e) => onFile(e, part, test)"
            />
          </label>

          <div v-if="errors[part.id]" class="banner err mt-2" style="padding:8px 12px; font-size:13px;">
            <Icon name="x-circle" :size="16" /> <span>{{ errors[part.id] }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({
  title: 'Audio uploads — Admin',
  meta: [
    { name: 'robots', content: 'noindex, nofollow, noarchive, nosnippet' }
  ]
})

interface Question { id: number; number: number; type: string }
interface Section { id: number; order_index: number; title?: string; audio_path?: string; questions?: Question[] }
interface Test { id: number; title: string; skill: string; sections: Section[] }

const toast = useToast()
const loading = ref(true)
const loadErr = ref('')
const loadErrCode = ref('')
const listeningTests = ref<Test[]>([])
const uploading = reactive<Record<number, boolean>>({})
const errors = reactive<Record<number, string>>({})

const totalParts = computed(() =>
  listeningTests.value.reduce((n, t) => n + (t.sections?.length || 0), 0)
)
const partsWithAudio = computed(() =>
  listeningTests.value.reduce((n, t) => n + (t.sections || []).filter(s => !!s.audio_path).length, 0)
)
const partsWithoutAudio = computed(() => totalParts.value - partsWithAudio.value)

function partsUploaded(test: Test) {
  return (test.sections || []).filter(s => !!s.audio_path).length
}

function sortedSections(test: Test) {
  return [...(test.sections || [])].sort((a, b) => a.order_index - b.order_index)
}

function defaultPartTitle(i: number) {
  const titles = [
    'Everyday social conversation (Part 1)',
    'Monologue in a social context (Part 2)',
    'Discussion in an academic context (Part 3)',
    'Academic lecture (Part 4)'
  ]
  return titles[i] || `Part ${i + 1}`
}

function questionRange(section: Section): string {
  const qs = section.questions || []
  if (!qs.length) return 'No questions yet'
  const nums = qs.map(q => q.number).filter(n => Number.isFinite(n))
  if (!nums.length) return 'No questions yet'
  const lo = Math.min(...nums), hi = Math.max(...nums)
  return lo === hi ? `Question ${lo}` : `Questions ${lo}–${hi}`
}

function shortPath(p: string) {
  if (!p) return ''
  const parts = p.split('/')
  return parts.slice(-2).join('/')
}

async function loadAll() {
  loading.value = true
  loadErr.value = ''
  loadErrCode.value = ''
  try {
    const all = await $fetch<Test[]>('/api/admin/tests')
    const listening = (all || []).filter((t: any) => t.skill === 'listening')
    const full: Test[] = []
    for (const t of listening) {
      try {
        const detailed = await $fetch<Test>(`/api/admin/tests/${t.id}`)
        full.push(detailed)
      } catch (inner: any) {
        // Don't let one bad test kill the whole page — log and keep going.
        // eslint-disable-next-line no-console
        console.warn(`[audio] Failed to load test ${t.id}:`, inner?.statusMessage || inner?.message)
      }
    }
    listeningTests.value = full
  } catch (e: any) {
    loadErr.value = e?.statusMessage || e?.data?.statusMessage || e?.message || 'Network error'
    loadErrCode.value = e?.data?.code || ''
    if (e?.statusCode === 401) {
      await navigateTo('/admin/login')
      return
    }
    const msg = String(loadErr.value).toLowerCase()
    if (msg.includes('corrupt') || msg.includes('malformed') || msg.includes('reset-db')) {
      loadErrCode.value = 'SQLITE_CORRUPT'
    }
  } finally {
    loading.value = false
  }
}

async function onFile(e: Event, part: Section, test: Test) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // Basic client-side validation
  if (!file.type.startsWith('audio/') && !/\.(mp3|wav|m4a)$/i.test(file.name)) {
    errors[part.id] = 'Please choose an MP3, WAV or M4A file.'
    input.value = ''
    return
  }
  if (file.size > 60 * 1024 * 1024) {
    errors[part.id] = 'File is over 60 MB — try compressing it.'
    input.value = ''
    return
  }

  errors[part.id] = ''
  uploading[part.id] = true
  try {
    const fd = new FormData()
    fd.append('kind', 'audio')
    fd.append('file', file)
    const r = await $fetch<{ path: string }>('/api/admin/upload', { method: 'POST', body: fd })
    await $fetch(`/api/admin/sections/${part.id}`, { method: 'PUT', body: { audio_path: r.path } })
    part.audio_path = r.path
    toast.success(`Audio attached to ${test.title} · Part ${part.order_index + 1}`)
  } catch (err: any) {
    errors[part.id] = err?.statusMessage || err?.message || 'Upload failed'
    toast.error(errors[part.id])
  } finally {
    uploading[part.id] = false
    input.value = ''
  }
}

onMounted(loadAll)
</script>

<style scoped>
.audio-page { display: block; }

.audio-head {
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; flex-wrap: wrap;
}
.audio-head__left { display: flex; align-items: center; gap: 14px; }
.audio-head__icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: inline-flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: #fff;
  box-shadow: 0 8px 18px -8px rgba(139, 92, 246, 0.55);
}

/* Summary */
.summary-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}
.summary-stat {
  display: flex; gap: 12px; align-items: center;
  padding: 14px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  color: var(--primary-700);
}
.summary-stat--warn { color: #92400E; background: #FFFBEB; border-color: #FDE68A; }
.summary-stat__num { font-size: 22px; font-weight: 800; line-height: 1; }
.summary-stat__label { font-size: 12px; color: var(--muted); margin-top: 2px; }

/* Test card */
.test-card { padding: 0; overflow: hidden; }
.test-card__head {
  display: flex; justify-content: space-between; align-items: center;
  gap: 14px; padding: 18px 22px;
  background: linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%);
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}
.test-card__num {
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--surface-2);
  color: var(--muted);
  font-family: monospace;
  font-size: 13px;
}

.status-pill {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}
.status-pill.ok { background: rgba(16, 185, 129, 0.12); color: #047857; }
.status-pill.partial { background: rgba(251, 191, 36, 0.18); color: #92400E; }

/* Parts grid */
.parts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  padding: 20px 22px 22px;
}
.part-tile {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex; flex-direction: column; gap: 12px;
  transition: all 150ms ease;
}
.part-tile:hover { border-color: var(--border-strong); box-shadow: var(--shadow-sm); }
.part-tile--missing { border-left: 3px solid #F59E0B; }

.part-tile__head { display: flex; align-items: center; gap: 12px; }
.part-tile__num {
  width: 38px; height: 38px; border-radius: 10px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: #fff; font-weight: 800;
  display: inline-flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 14px -6px rgba(14, 165, 233, 0.6);
  flex-shrink: 0;
}
.part-tile--missing .part-tile__num {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  box-shadow: 0 6px 14px -6px rgba(245, 158, 11, 0.6);
}

.part-tile__meta {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
}
.part-tile__range {
  display: inline-flex; align-items: center; gap: 6px;
  color: var(--primary-700);
  font-weight: 600;
}
.part-tile__count { color: var(--muted); font-size: 12px; }

.status-row {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 600;
  padding: 4px 10px; border-radius: 999px;
}
.status-row.ok { background: rgba(16, 185, 129, 0.12); color: #047857; }
.status-row.warn { background: rgba(251, 191, 36, 0.18); color: #92400E; }

.audio-player { width: 100%; margin-top: 8px; }
.file-path {
  display: inline-flex; align-items: center; gap: 4px;
  margin-top: 4px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

.audio-drop {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 18px 14px;
  border: 2px dashed var(--border-strong);
  border-radius: var(--radius);
  background: #fff;
  color: var(--primary-700);
  cursor: pointer;
  text-align: center;
  transition: all 150ms ease;
}
.audio-drop:hover {
  border-color: var(--primary);
  background: var(--primary-50);
  color: var(--primary-700);
}
.audio-drop--busy { opacity: 0.7; cursor: progress; }
.audio-drop__label { font-weight: 600; margin-top: 6px; font-size: 14px; }

/* DB-corrupt recovery card */
.recover-card {
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  border-left: 4px solid #F59E0B;
  border-radius: var(--radius-lg);
  padding: 20px 22px;
  box-shadow: var(--shadow-sm);
}
.recover-card__head {
  display: flex; align-items: flex-start; gap: 14px;
  padding-bottom: 14px;
  border-bottom: 1px dashed #FDE68A;
  margin-bottom: 14px;
}
.recover-card__icon {
  width: 40px; height: 40px; border-radius: 10px;
  display: inline-flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #F59E0B, #EF4444);
  color: #fff;
  flex-shrink: 0;
}
.recover-steps {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex; flex-direction: column; gap: 12px;
}
.recover-steps li {
  display: flex; align-items: flex-start; gap: 12px;
}
.recover-steps__num {
  flex-shrink: 0;
  width: 28px; height: 28px; border-radius: 999px;
  background: #F59E0B; color: #fff;
  display: inline-flex; align-items: center; justify-content: center;
  font-weight: 700;
  font-size: 13px;
  box-shadow: 0 4px 10px -4px rgba(245, 158, 11, 0.6);
}
.recover-cmd {
  margin: 6px 0 0;
  padding: 8px 12px;
  background: #111827;
  color: #F9FAFB;
  border-radius: 6px;
  font-family: ui-monospace, 'SFMono-Regular', Menlo, monospace;
  font-size: 13px;
  overflow-x: auto;
}
kbd {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 4px;
  background: #fff;
  border: 1px solid #D1D5DB;
  box-shadow: 0 1px 0 #D1D5DB;
  font-family: ui-monospace, monospace;
  font-size: 11px;
  color: #374151;
}
</style>
