<script setup lang="ts">
import { useCountryStore } from '../../stores/country'
import formatPopulation from '../../utils/formatPopulation'

const store = useCountryStore()
</script>

<template>
  <div class="shadow-inherit shadow-2xl rounded-md border border-2 border-slate-500/40">
    <div
      v-if="!store.country"
      class="mx-16 my-6 w-full min-w-40">
      <p>Pointez vers un pays</p>
    </div>
    <div
      v-else
      class="p-6 min-w-40 w-full">
      <h2 class="text-2xl font-bold mb-2">{{ store.country?.name }}</h2>
      <p class="text-sm text-gray-600 mb-4 italic">{{ store.country?.officialName }}</p>

      <div class="flex items-center space-x-2 mb-2">
        <img
          src="/src/assets/users.svg"
          width="20" />
        <span class="font-medium">{{ formatPopulation(store.country?.population) }}</span>
      </div>

      <div class="mt-4 pt-4 border-t border-gray-600">
        <p class="text-sm text-gray-500">Données de population de {{ store.country?.populationDate }}</p>
      </div>
    </div>
  </div>
</template>
