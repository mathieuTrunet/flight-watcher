<script setup lang="ts">
import Globe from './components/Globe.vue'
import Card from './components/Card.vue'
import SelectedFlight from './components/SelectedFlight.vue'
import Statistics from './components/Statistics.vue'
</script>

<template>
  <div>
    <Globe />
    <div class="over-content">
      <div class="card">
        <Card>
          <Statistics />
        </Card>
      </div>
      <div />
      <div class="card">
        <Card>
          <SelectedFlight />
        </Card>
      </div>
    </div>
  </div>
</template>
