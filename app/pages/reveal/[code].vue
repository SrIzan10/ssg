<script setup lang="ts">
import { ref, onMounted } from 'vue'

const route = useRoute()
const revealed = ref(false)
const receiver = ref('')
const giver = ref('')
const error = ref('')

const { decodePairing } = useSecretSanta()

onMounted(() => {
  try {
    const code = route.params.code as string
    if (!code) {
      error.value = 'Invalid link'
      return
    }

    const pairing = decodePairing(code)
    giver.value = pairing.giver
    receiver.value = pairing.receiver
  }
  catch (err: any) {
    error.value = 'Invalid or corrupted link'
  }
})

function reveal() {
  revealed.value = true
}
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div v-if="error" class="text-center space-y-4">
        <div class="text-2xl font-bold text-red-400">Error</div>
        <p class="text-zinc-400">{{ error }}</p>
        <NuxtLink
          to="/"
          class="inline-block px-4 py-2 bg-zinc-900 border border-zinc-800 text-sm hover:bg-zinc-800 transition-colors"
        >
          Back to Generator
        </NuxtLink>
      </div>

      <div v-else-if="!revealed" class="text-center space-y-8">
        <div>
          <h1 class="text-4xl font-bold tracking-tight mb-2">ssg</h1>
          <p class="text-zinc-400 text-sm">secret santa generator</p>
        </div>

        <div class="space-y-4">
          <p class="text-zinc-300">Hello <span class="font-medium text-zinc-50">{{ giver }}</span>!</p>
          <p class="text-zinc-400 text-sm">Click the button below to find out who you're gifting to.</p>
        </div>

        <button
          @click="reveal"
          class="w-full bg-zinc-100 text-zinc-950 px-6 py-3 font-medium hover:bg-zinc-200 transition-colors text-lg"
        >
          Reveal
        </button>
      </div>

       <div v-else class="text-center space-y-8">
         <div>
           <h1 class="text-4xl font-bold tracking-tight mb-2">ssg</h1>
           <p class="text-zinc-400 text-sm">secret santa generator</p>
         </div>

         <div class="border border-zinc-800 bg-zinc-900 p-8 space-y-4">
           <p class="text-zinc-500 text-sm uppercase tracking-wider">You are gifting to</p>
           <p class="text-3xl font-bold">{{ receiver }}</p>
         </div>

         <p class="text-zinc-400 text-sm">🎄 Happy secret santa-ing! 🎄</p>

         <NuxtLink
           to="/"
           class="block px-4 py-2 bg-zinc-900 border border-zinc-800 text-sm text-zinc-400 hover:bg-zinc-800 transition-colors"
         >
           Create New Secret Santa
         </NuxtLink>
       </div>
    </div>
  </div>
</template>
