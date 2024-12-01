<script setup lang="ts">
import Globe from './components/Globe.vue'
import Menu from './components/MenuBar/Menu.vue'

const MOBILE_BREAKPOINT = 768
const screenWidth = window.innerWidth

if (screenWidth < MOBILE_BREAKPOINT) alert(`Cette application n'est pas prévue pour être consultée sur mobile`)
</script>

<template>
  <div
    v-if="screenWidth >= MOBILE_BREAKPOINT"
    class="relative w-full h-full">
    <Globe />
    <Menu />
  </div>
</template>
