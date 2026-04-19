<template>
  <div>
    <div class="skill-head">
      <div class="skill-head__left">
        <span class="skill-head__icon" :class="`skill-head__icon--${skill}`">
          <Icon :name="skillIcon" :size="18" />
        </span>
        <div>
          <h1 style="margin:0;">{{ skillLabel }} tests</h1>
          <p class="text-muted" style="margin:2px 0 0;">
            All {{ skill }} mock tests. Click a test to edit sections, upload audio and add questions.
          </p>
        </div>
      </div>
      <button class="btn cta" @click="create" :disabled="creating">
        <Icon name="plus" :size="16" />
        {{ creating ? 'Creating…' : `New ${skillLabel} test` }}
      </button>
    </div>

    <div v-if="pending && !filtered.length" class="empty mt-4">
      <Icon name="loader" :size="26" />
      <p style="margin:8px 0 0;">Loading tests…</p>
    </div>

    <div v-else-if="loadErr" class="banner err mt-4">
      <Icon name="x-circle" :size="18" />
      <div style="flex:1;">
        <strong>Couldn't load tests.</strong>
        <div class="text-xs text-muted">{{ loadErr }}</div>
      </div>
      <button class="btn ghost sm" @click="refresh">
        <Icon name="refresh-cw" :size="14" /> Retry
      </button>
    </div>

    <div v-else-if="!filtered.length" class="empty mt-4">
      <Icon :name="skillIcon" :size="28" />
      <p style="margin:8px 0 0;">
        No {{ skill }} tests yet. Create your first one to get started.
      </p>
      <button class="btn mt-3" @click="create">
        <Icon name="plus" :size="16" /> Add a {{ skillLabel }} test
      </button>
    </div>

    <div v-else class="card mt-4" style="padding:0; overflow:hidden;">
      <table class="admin-table polished">
        <thead>
          <tr>
            <th style="width:64px;">ID</th>
            <th>Title</th>
            <th style="width:120px;">Duration</th>
            <th style="width:140px;">Status</th>
            <th style="width:160px; text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in filtered" :key="t.id">
            <td><code class="id-chip">#{{ t.id }}</code></td>
            <td>
              <div style="font-weight:600;">{{ t.title }}</div>
              <div class="text-xs text-muted">Created {{ formatDate(t.created_at) }}</div>
            </td>
            <td>{{ t.duration_min }} min</td>
            <td>
              <span class="status-pill" :class="t.published ? 'ok' : 'draft'">
                <Icon :name="t.published ? 'check-circle' : 'edit'" :size="13" />
                {{ t.published ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td style="text-align:right;">
              <NuxtLink :to="`/admin/${skill}/${t.id}`" class="btn secondary sm">
                <Icon name="edit" :size="13" /> Edit
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ skill: string }>()
const modal = useModal()
const toast = useToast()

const creating = ref(false)
const loadErr = ref('')
const { data: all, pending, refresh } = await useFetch<any[]>('/api/admin/tests', {
  onResponseError({ response }) {
    loadErr.value = response?.statusText || 'Network error'
  }
})
const filtered = computed(() => (all.value || []).filter(t => t.skill === props.skill))

const skillIcon = computed(() => ({
  reading: 'book-open',
  listening: 'headphones',
  writing: 'pen-tool',
  speaking: 'mic'
} as Record<string, string>)[props.skill] || 'file-text')

const skillLabel = computed(() =>
  props.skill ? props.skill[0].toUpperCase() + props.skill.slice(1) : ''
)

function formatDate(v: any) {
  if (!v) return '—'
  try {
    const d = new Date(v)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return '—' }
}

async function create() {
  const title = await modal.prompt({
    title: `New ${skillLabel.value} test`,
    message: 'Give this mock test a clear, descriptive title. You can edit it later.',
    placeholder: `e.g. ${skillLabel.value} Practice Test 5`,
    defaultValue: `New ${skillLabel.value} test`,
    confirmText: 'Create test',
    variant: 'info',
    icon: skillIcon.value
  })
  if (!title || !title.trim()) return
  creating.value = true
  try {
    await $fetch('/api/admin/tests', {
      method: 'POST',
      body: { title: title.trim(), skill: props.skill }
    })
    toast.success(`${skillLabel.value} test created`)
    await refresh()
  } catch (e: any) {
    toast.error(e?.statusMessage || 'Couldn\'t create test')
  } finally {
    creating.value = false
  }
}
</script>

<style scoped>
.skill-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.skill-head__left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.skill-head__icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: inline-flex; align-items: center; justify-content: center;
  color: #fff;
  box-shadow: 0 8px 18px -8px rgba(14, 165, 233, 0.55);
  background: linear-gradient(135deg, var(--primary), var(--secondary));
}
.skill-head__icon--reading { background: linear-gradient(135deg, #0ea5e9, #6366f1); }
.skill-head__icon--listening { background: linear-gradient(135deg, #8b5cf6, #ec4899); }
.skill-head__icon--writing { background: linear-gradient(135deg, #f59e0b, #ef4444); }
.skill-head__icon--speaking { background: linear-gradient(135deg, #10b981, #14b8a6); }

.admin-table.polished {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
}
.admin-table.polished thead th {
  background: var(--surface-2);
  color: var(--text-muted);
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 12px 18px;
  border-bottom: 1px solid var(--border);
}
.admin-table.polished tbody td {
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}
.admin-table.polished tbody tr:hover {
  background: var(--surface-2);
}
.admin-table.polished tbody tr:last-child td {
  border-bottom: none;
}

.id-chip {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--surface-2);
  color: var(--text-muted);
  font-size: 12px;
}

.status-pill {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
.status-pill.ok {
  background: rgba(16, 185, 129, 0.12);
  color: #047857;
}
.status-pill.draft {
  background: rgba(251, 191, 36, 0.15);
  color: #92400e;
}

.btn.sm {
  padding: 5px 10px;
  font-size: 13px;
}
</style>
