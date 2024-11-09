<script setup lang="ts">
import { useFlightStore } from '../stores/flight'

const store = useFlightStore()
</script>

<template>
  <div class="top-div">
    <template v-if="store.selectedFlight">
      <h1 class="title">{{ store.selectedFlight.icao24 }}</h1>
      <p>{{ store.selectedFlight.origin_country && `Origine : ${store.selectedFlight.origin_country}` }}</p>
    </template>
    <p v-else>Cliquer sur un vol</p>
  </div>
</template>
