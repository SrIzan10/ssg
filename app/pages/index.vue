<script setup lang="ts">
import { ref, watch } from 'vue'

const participants = ref<string[]>(['', ''])
const pairings = ref<any[]>([])
const generated = ref(false)
const error = ref('')
const copied = ref<number | null>(null)

const { generatePairings, encodePairing } = useSecretSanta()

// Auto-expand participant list when last field is filled
watch(participants, (newParticipants) => {
  const lastIndex = newParticipants.length - 1
  if (lastIndex >= 0 && newParticipants[lastIndex].trim().length > 0) {
    if (newParticipants.length < 10) { // Limit to 10 participants
      participants.value.push('')
    }
  }
}, { deep: true })

function removeParticipant(index: number) {
  participants.value.splice(index, 1)
}

function generate() {
  error.value = ''
  const names = participants.value
    .map(n => n.trim())
    .filter(n => n.length > 0)

  if (names.length < 2) {
    error.value = 'Add at least 2 participants'
    return
  }

  try {
    const pairs = generatePairings(names)
    pairings.value = pairs.map(p => ({
      giver: p.giver,
      receiver: p.receiver,
      encoded: encodePairing(p),
    }))
    generated.value = true
  }
  catch (err: any) {
    error.value = err.message
  }
}

function reset() {
  participants.value = ['', '']
  pairings.value = []
  generated.value = false
  error.value = ''
  copied.value = null
}

function getParticipantLink(encoded: string) {
  if (process.client) {
    return `${window.location.origin}/reveal/${encoded}`
  }
  return `/reveal/${encoded}`
}

async function copyToClipboard(text: string, index: number) {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      copied.value = index
      setTimeout(() => {
        copied.value = null
      }, 2000)
    } else {
      // Fallback for environments without clipboard API
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      copied.value = index
      setTimeout(() => {
        copied.value = null
      }, 2000)
    }
  }
  catch (err) {
    error.value = 'Failed to copy to clipboard'
  }
}
</script>


<template>
  <div class="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50 p-6 md:p-12">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-5xl font-bold tracking-tight mb-2">ssg</h1>
        <p class="text-zinc-400 text-base">secret santa generator</p>
      </div>

      <!-- Generator Form -->
      <div v-if="!generated" class="space-y-8">
        <div class="space-y-4">
          <label class="block text-sm font-medium text-zinc-300">Participants</label>
          <div class="space-y-3">
            <div v-for="(participant, index) in participants" :key="index" class="flex gap-3">
              <input
                v-model="participants[index]"
                type="text"
                placeholder="Enter name"
                class="flex-1 bg-zinc-800/50 border border-zinc-700 px-4 py-2.5 text-sm text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors rounded"
              />
              <button
                v-if="participants.length > 2"
                @click="removeParticipant(index)"
                class="px-3 py-2.5 bg-zinc-800/50 border border-zinc-700 text-zinc-400 text-sm hover:bg-red-900/20 hover:border-red-700 transition-colors rounded"
                title="Remove participant"
              >
                ✕
              </button>
            </div>
          </div>
          <p class="text-xs text-zinc-500">{{ participants.filter(p => p.trim()).length }} participant(s) added</p>
        </div>

        <div v-if="error" class="bg-red-900/20 border border-red-800 px-4 py-3 text-sm text-red-400 rounded">
          {{ error }}
        </div>

        <button
          @click="generate"
          class="w-full bg-zinc-100 text-zinc-950 px-6 py-3 text-sm font-medium hover:bg-zinc-200 transition-colors rounded font-semibold"
        >
          Generate Pairings
        </button>
      </div>

      <!-- Results -->
      <div v-else class="space-y-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-semibold mb-1">Pairings Generated</h2>
            <p class="text-zinc-400 text-sm">{{ pairings.length }} participant(s)</p>
          </div>
          <button
            @click="reset"
            class="px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors rounded"
          >
            Reset
          </button>
        </div>

        <div class="space-y-3">
          <div v-for="(pairing, index) in pairings" :key="index" class="border border-zinc-700 bg-zinc-800/30 rounded overflow-hidden">
            <div class="p-5 space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs text-zinc-300 uppercase tracking-wider mb-1 font-semibold">Link for {{ pairing.giver }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <input
                  :value="getParticipantLink(pairing.encoded)"
                  readonly
                  type="text"
                  class="flex-1 bg-zinc-700/50 border border-zinc-600 px-3 py-2 text-xs text-zinc-400 focus:outline-none rounded"
                />
                <button
                  @click="copyToClipboard(getParticipantLink(pairing.encoded), index)"
                  :class="[
                    'px-3 py-2 text-xs font-medium rounded transition-colors',
                    copied === index
                      ? 'bg-green-900/30 border border-green-700 text-green-400'
                      : 'bg-zinc-700/50 border border-zinc-600 text-zinc-300 hover:bg-zinc-600/50'
                  ]"
                >
                  {{ copied === index ? '✓ Copied' : 'Copy' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
