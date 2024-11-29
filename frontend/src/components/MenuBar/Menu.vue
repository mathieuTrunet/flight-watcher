<script setup lang="ts">
import Title from './Title.vue'
import FlightSelector from './FlightSelector.vue'
import PieChart from './PieChart.vue'
</script>

<template>
  <div
    class="flex flex-col items-center absolute z-2 shadow-inherit shadow-2xl bg-clip-padding backdrop-filter backdrop-blur-md bg-slate-500 bg-opacity-10 rounded-md mx-4 my-2 p-4 border border-2 border-slate-500/40 w-96 max-h-[90vh] h-fit overflow-y-auto overflow-x-hidden">
    <Title />
    <FlightSelector />
    <PieChart />
  </div>
</template>
