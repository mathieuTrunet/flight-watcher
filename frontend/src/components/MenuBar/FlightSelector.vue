<script setup lang="ts">
import { computed } from 'vue'
import { useFlightStore } from '../../stores/flight'
import FlightSelectorDataRow from './FlightSelectorDataRow.vue'
import getPolaricDirection from '../../utils/getPolaricDirection'

const store = useFlightStore()

const selectedFlight = computed(() => store.selectedFlight)

const polaricDirection = computed(() => selectedFlight.value?.[6] && getPolaricDirection(selectedFlight.value[6]))
</script>

<template>
  <div class="shadow-inherit shadow-2xl rounded-md border border-2 border-slate-500/40">
    <div
      v-if="!selectedFlight"
      class="mx-16 my-6 min-w-40 w-full">
      <p>Selectionnez un vol</p>
    </div>
    <div
      v-else
      class="p-6 min-w-80 w-full">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-xl font-bold">{{ selectedFlight[0] }}</h3>
          <div class="flex items-center gap-2 mt-1 text-slate-300">
            <img
              src="/src/assets/flag.svg"
              width="18" />
            <span>{{ selectedFlight[1] }}</span>
          </div>
        </div>
        <div
          :class="`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
            !selectedFlight[4] ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`">
          <template v-if="!selectedFlight[4]">
            <img
              src="/src/assets/plane.svg"
              width="18" />
            <span>En vol</span>
          </template>
          <template v-else>
            <img
              src="/src/assets/plane-landing.svg"
              width="18" />
            <span>Au sol</span>
          </template>
        </div>
      </div>
      <div class="flex items-center gap-4 text-sm text-slate-300 mb-3">
        <div>
          <span class="font-medium">Lat: </span>
          {{ selectedFlight[3] }}°
        </div>
        <div>
          <span class="font-medium">Lng: </span>
          {{ selectedFlight[2] }}°
        </div>
      </div>
      <div className="space-y-1 border-t border-gray-600 pt-4">
        <FlightSelectorDataRow
          label="Vitesse"
          :value="selectedFlight[5] ? Math.floor(selectedFlight[5]) : selectedFlight[5]"
          unit="m/s" />
        <FlightSelectorDataRow
          label="Direction"
          :value="`${polaricDirection}${selectedFlight[6] && ' - '}${
            selectedFlight[6] ? Math.floor(selectedFlight[6]) : selectedFlight[6]
          }`"
          unit="°" />
        <FlightSelectorDataRow
          label="Elevation"
          :value="selectedFlight[7] ? Math.floor(selectedFlight[7]) : selectedFlight[7]"
          unit="m/s" />
        <FlightSelectorDataRow
          label="Altitude"
          :value="selectedFlight[4] ? null : selectedFlight[8] ? Math.floor(selectedFlight[8]) : selectedFlight[8]"
          unit="m" />
        <FlightSelectorDataRow
          label="Identifiant Squawk"
          :value="selectedFlight[9]" />
      </div>
    </div>
  </div>
</template>
