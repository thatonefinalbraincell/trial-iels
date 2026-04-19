<template>
  <div>
    <div class="row between wrap">
      <div>
        <h1>All tests</h1>
        <p class="subtitle">The 4 mock tests below are pre-seeded. Use <strong>Edit</strong> to tweak questions, or the quick links to upload listening audio.</p>
      </div>
      <button class="btn cta" @click="showNew = !showNew">
        <Icon name="plus" :size="16" /> New test
      </button>
    </div>

    <div v-if="showNew" class="card form mt-3" style="margin-top:16px;">
      <label>Title</label>
      <input v-model="newTest.title" placeholder="e.g., Cambridge IELTS 20 Academic Reading Test 5" />
      <label>Skill</label>
      <select v-model="newTest.skill">
        <option value="reading">Reading</option>
        <option value="listening">Listening</option>
        <option value="writing">Writing</option>
        <option value="speaking">Speaking</option>
      </select>
      <label>Description</label>
      <textarea v-model="newTest.description" rows="2"></textarea>
      <label>Duration (minutes)</label>
      <input type="number" v-model.number="newTest.duration_min" />
      <div class="row mt-3">
        <button class="btn" @click="createTest"><Icon name="check" :size="14" /> Create</button>
        <button class="btn ghost" @click="showNew = false">Cancel</button>
      </div>
    </div>

    <table class="admin-table mt-4">
      <thead>
        <tr><th>ID</th><th>Title</th><th>Skill</th><th>Duration</th><th>Published</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="t in tests" :key="t.id">
          <td>{{ t.id }}</td>
          <td style="font-weight:600;">{{ t.title }}</td>
          <td><span :class="'badge ' + t.skill">{{ t.skill }}</span></td>
          <td>{{ t.duration_min }} min</td>
          <td>
            <span v-if="t.published" class="badge" style="background:#D1FAE5; color:#065F46;">
              <Icon name="check" :size="12" /> Published
            </span>
            <span v-else class="badge" style="background:#FEE2E2; color:#991B1B;">Draft</span>
          </td>
          <td>
            <div class="row" style="gap:6px;">
              <NuxtLink :to="`/admin/${t.skill}/${t.id}`" class="btn secondary sm">
                <Icon name="edit" :size="13" /> Edit
              </NuxtLink>
              <button class="btn danger sm" @click="remove(t.id)">
                <Icon name="trash" :size="13" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { data: tests, refresh } = await useFetch<any[]>('/api/admin/tests')
const showNew = ref(false)
const newTest = reactive({ title: '', skill: 'reading', description: '', duration_min: 60 })

const modal = useModal()
const toast = useToast()

async function createTest() {
  if (!newTest.title) {
    await modal.alert({ title: 'Title required', message: 'Enter a title for the new test before saving.', variant: 'warn' })
    return
  }
  await $fetch('/api/admin/tests', { method: 'POST', body: { ...newTest } })
  showNew.value = false
  newTest.title = ''; newTest.description = ''
  await refresh()
  toast.success('Test created', { title: 'Saved' })
}
async function remove(id: number) {
  const ok = await modal.confirm({
    title: 'Delete this test?',
    message: 'This will remove the test and every section, question and answer attached to it. This cannot be undone.',
    confirmText: 'Delete test',
    variant: 'danger',
    danger: true
  })
  if (!ok) return
  await $fetch(`/api/admin/tests/${id}`, { method: 'DELETE' })
  await refresh()
  toast.success('Test deleted')
}
</script>
