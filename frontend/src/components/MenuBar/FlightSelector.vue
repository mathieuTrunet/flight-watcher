<script setup lang="ts">
import { useFlightStore } from '../../stores/flight'

const store = useFlightStore()
</script>

<template>
  <div class="shadow-inherit shadow-2xl rounded-md border border-2 border-slate-500/40">
    <p>{{ store.selectedFlight?.[1] || 'g' }}</p>
  </div>
</template>
