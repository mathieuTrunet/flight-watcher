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

<style scoped lang="scss">
.over-content {
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.card {
  margin: 20px;
  padding: 10px;
}
</style>
