<script setup lang="ts">
const GITHUB_REPOSITORY_URL = `https://github.com/mathieuTrunet/flight-watcher`
const LINKEDIN_PROFILE_URL = `https://www.linkedin.com/in/mathieu-trunet/`
</script>

<template>
  <span
    class="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r to-orange-600 from-red-400"
    >Flight Watcher</span
  >

  <div class="mt-2 mb-6 flex space-x-2">
    <a
      :href="GITHUB_REPOSITORY_URL"
      target="_blank">
      <img
        src="/src/assets/github-icon.svg"
        width="30" />
    </a>
    <div class="border-l border-gray-600" />
    <a
      :href="LINKEDIN_PROFILE_URL"
      target="_blank">
      <img
        src="/src/assets/linkedin-icon.svg"
        width="30" />
    </a>
  </div>
</template>
