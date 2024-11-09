<script setup lang="ts">
import { useFlightStore } from '../stores/flight'

const store = useFlightStore()
</script>

<template>
  <div
    class="absolute z-2 shadow-inherit shadow-2xl backdrop-blur-sm bg-slate-500/30 rounded-md mx-4 my-2 p-4 border-2 border-slate-500/10 w-96">
    <template v-if="store.selectedFlight">
      <h1 class="title">{{ store.selectedFlight.icao24 }}</h1>
      <p>{{ store.selectedFlight.origin_country && `Origine : ${store.selectedFlight.origin_country}` }}</p>
    </template>
    <p v-else>Cliquer sur un vol</p>
  </div>
</template>
