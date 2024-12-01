<script setup lang="ts">
import { ref } from 'vue'
import { useFlightStore } from '../../stores/flight'
import { useErrorStore } from '../../stores/error'

const INFORMATION_TOGGLE_DELAY_MILLISECONDS = 250
const NO_DATA_RECEIVE_DELAY_MILLISECONDS = 21_000

const flightStore = useFlightStore()
const errorStore = useErrorStore()

const dotIsHovered = ref<boolean>(false)

const toggleInformationBubble = () =>
  setTimeout(() => (dotIsHovered.value = true), INFORMATION_TOGGLE_DELAY_MILLISECONDS)

const getInformationBubbleContent = () => {
  if (errorStore.error) return `Le service ne semble pas fonctionner correctement:${errorStore.errorMessage}`

  if (flightStore.flight.length) return `Le service fonctionne correctement`

  return `Le service démarre`
}

setTimeout(() => {
  if (!flightStore.flight.length || errorStore.error) return
  errorStore.setError(true)
  errorStore.setErrorMessage(`Le service n'a pas démarré correctement, essayez de recharger la page`)
}, NO_DATA_RECEIVE_DELAY_MILLISECONDS)
</script>

<template>
  <div>
    <status-indicator
      v-if="errorStore.error"
      @mouseover="toggleInformationBubble"
      @mouseout="() => (dotIsHovered = false)"
      negative
      pulse />
    <status-indicator
      v-else-if="flightStore.flight.length"
      @mouseover="toggleInformationBubble"
      @mouseout="() => (dotIsHovered = false)"
      positive
      pulse />
    <status-indicator
      v-else
      @mouseover="toggleInformationBubble"
      @mouseout="() => (dotIsHovered = false)"
      intermediary
      pulse />
    <Transition name="fade">
      <div
        v-if="dotIsHovered"
        class="-translate-y-6 ml-6 w-full max-w-xs p-5 bg-slate-600 rounded-lg font-mono text-center">
        {{ getInformationBubbleContent() }}
      </div>
    </Transition>
  </div>
</template>
