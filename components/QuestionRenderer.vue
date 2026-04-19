<!--
  Universal question renderer — supports every IELTS question type.
  Dispatches on `question.type` and reads config from `question.data`.
  Emits 'update' with the user's response; the parent owns response state.
-->
<template>
  <div class="question">
    <span class="qnum">{{ question.number ?? question.order_index + 1 }}</span>
    <span class="q-prompt" v-html="question.prompt"></span>

    <!-- MULTIPLE CHOICE single ----------------------------------------------->
    <div v-if="type === 'mcq_single'" class="options">
      <label v-for="(opt, i) in question.data?.options || []" :key="i">
        <input type="radio" :name="`q-${question.id}`" :value="letter(i)"
               :checked="modelValue === letter(i)" @change="emit('update', letter(i))"/>
        <strong>{{ letter(i) }}.</strong> {{ opt }}
      </label>
    </div>

    <!-- MULTIPLE CHOICE multi ------------------------------------------------>
    <div v-else-if="type === 'mcq_multi'" class="options">
      <small style="color:#555;">Choose {{ question.data?.choose ?? 2 }} answers.</small>
      <label v-for="(opt, i) in question.data?.options || []" :key="i">
        <input type="checkbox" :value="letter(i)"
               :checked="Array.isArray(modelValue) && modelValue.includes(letter(i))"
               @change="toggleMulti(letter(i), ($event.target as HTMLInputElement).checked)"/>
        <strong>{{ letter(i) }}.</strong> {{ opt }}
      </label>
    </div>

    <!-- TRUE/FALSE/NOT GIVEN -------------------------------------------------->
    <div v-else-if="type === 'tfng'" class="options">
      <label v-for="val in ['TRUE','FALSE','NOT GIVEN']" :key="val">
        <input type="radio" :name="`q-${question.id}`" :value="val"
               :checked="modelValue === val" @change="emit('update', val)"/> {{ val }}
      </label>
    </div>

    <!-- YES/NO/NOT GIVEN ------------------------------------------------------>
    <div v-else-if="type === 'ynng'" class="options">
      <label v-for="val in ['YES','NO','NOT GIVEN']" :key="val">
        <input type="radio" :name="`q-${question.id}`" :value="val"
               :checked="modelValue === val" @change="emit('update', val)"/> {{ val }}
      </label>
    </div>

    <!-- MATCHING HEADINGS ---------------------------------------------------->
    <div v-else-if="type === 'matching_headings'" style="margin-left:40px;">
      <select :value="modelValue || ''" @change="emit('update', ($event.target as HTMLSelectElement).value)"
              style="padding:6px; font-size:14px;">
        <option value="">-- Select heading --</option>
        <option v-for="h in question.data?.headings || []" :key="h.id" :value="h.id">
          {{ h.id }}. {{ h.text }}
        </option>
      </select>
    </div>

    <!-- MATCHING INFORMATION / FEATURES -------------------------------------->
    <div v-else-if="type === 'matching_information' || type === 'matching_features' || type === 'matching'" style="margin-left:40px;">
      <select :value="modelValue || ''" @change="emit('update', ($event.target as HTMLSelectElement).value)"
              style="padding:6px; font-size:14px;">
        <option value="">-- Select --</option>
        <option v-for="opt in question.data?.options || []" :key="opt.id" :value="opt.id">
          {{ opt.id }}. {{ opt.text }}
        </option>
      </select>
    </div>

    <!-- FILL IN THE BLANK types (completion + short answer) ------------------>
    <div v-else-if="isCompletion" class="options">
      <small v-if="question.data?.word_limit" style="color:#555; display:block; margin-bottom:4px;">
        Write <strong>NO MORE THAN {{ question.data.word_limit }} WORDS</strong> from the passage.
      </small>
      <input type="text" :value="modelValue || ''" @input="emit('update', ($event.target as HTMLInputElement).value)"
             :placeholder="question.data?.placeholder || 'Your answer...'"/>
    </div>

    <!-- WRITING long response ------------------------------------------------>
    <div v-else-if="type === 'writing'" style="margin-top:10px;">
      <textarea class="writing-editor" :value="modelValue || ''"
                @input="emit('update', ($event.target as HTMLTextAreaElement).value)"
                :placeholder="'Write your response here (minimum ' + (question.data?.min_words || 150) + ' words)'"></textarea>
      <div class="word-count">Words: {{ wordCount(modelValue) }} / min {{ question.data?.min_words || 150 }}</div>
    </div>

    <!-- SPEAKING recording -------------------------------------------------->
    <div v-else-if="type === 'speaking'" style="margin-top:10px;">
      <p v-if="question.data?.cue_card" v-html="question.data.cue_card" style="font-style:italic;"></p>
      <SpeakingRecorder :question-id="question.id" :audio="modelValue" @update="emit('update', $event)" />
    </div>

    <!-- UNKNOWN fallback ---------------------------------------------------->
    <div v-else class="options">
      <input type="text" :value="modelValue || ''" @input="emit('update', ($event.target as HTMLInputElement).value)"/>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ question: any; modelValue?: any }>()
const emit = defineEmits<{ (e: 'update', v: any): void }>()

const type = computed<string>(() => {
  const t = props.question.type as string
  // strip the skill prefix (reading_, listening_) to get normalized type
  return t.replace(/^(reading|listening)_/, '')
    .replace(/^writing_.*/, 'writing')
    .replace(/^speaking_.*/, 'speaking')
})

const isCompletion = computed(() =>
  ['sentence_completion','summary_completion','note_completion','table_completion',
   'form_completion','flowchart_completion','short_answer','diagram_labelling',
   'map_labelling'].includes(type.value)
)

function letter(i: number) { return String.fromCharCode(65 + i) }

function toggleMulti(val: string, checked: boolean) {
  const cur: string[] = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  const idx = cur.indexOf(val)
  if (checked && idx < 0) cur.push(val)
  if (!checked && idx >= 0) cur.splice(idx, 1)
  emit('update', cur.sort())
}

function wordCount(s: any) {
  if (!s) return 0
  return String(s).trim().split(/\s+/).filter(Boolean).length
}
</script>
