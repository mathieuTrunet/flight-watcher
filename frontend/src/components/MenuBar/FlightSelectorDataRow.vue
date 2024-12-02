<script setup lang="ts">
const { label, value, unit } = defineProps<{ label: string; value: string | number | null; unit?: string }>()
</script>

<template>
  <div class="flex justify-between items-center py-1 font-mono">
    <span class="text-slate-300"> {{ label }}</span>
    <span class="font-medium">
      <template v-if="value !== null">
        {{ value
        }}<span
          v-if="unit"
          class="text-gray-500 ml-1"
          >{{ unit }}</span
        >
      </template>
      <span
        v-else
        class="text-gray-400"
        >N/A</span
      >
    </span>
  </div>
</template>
