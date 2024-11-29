<script setup lang="ts">
import * as d3 from 'd3'
import { computed, ref, watch } from 'vue'
import { useFlightStore } from '../../stores/flight'
import _ from 'lodash'

const NUMBER_OF_DISPLAYED_COUNTRIES = 6
const COLOR_CODE_LIST = ['#FF8D00', '#FF7B20', '#FFB071', '#FF9E5C', '#FF8C45', '#FF7A3A', '#5c5c5ccc']

const store = useFlightStore()

const countriesCount = computed(() =>
  _.map(_.countBy(store.flight.map(flight => flight[1])), (value, name) => ({ name, value })).sort(
    (a, b) => b.value - a.value
  )
)

const data = computed(() => [
  ...[...Array(NUMBER_OF_DISPLAYED_COUNTRIES).keys()].map((_, index) => countriesCount.value[index]),
  {
    name: 'autre',
    value: countriesCount.value.reduce((sum, value) => sum + value.value, 0) / 25,
  },
])

const otherCountriesCount = computed(() =>
  countriesCount.value.slice(NUMBER_OF_DISPLAYED_COUNTRIES).reduce((sum, value) => sum + value.value, 0)
)

const { size = 250 } = defineProps<{ size?: number }>()

const hoveredData = ref<string | null>(null)

const chartInstance = ref<HTMLDivElement | null>(null)

const drawChart = () => {
  if (!chartInstance.value) return

  d3.select(chartInstance.value).selectAll('*').remove()

  const svg = d3
    .select(chartInstance.value)
    .append('svg')
    .attr('width', size)
    .attr('height', size)
    .append('g')
    .attr('transform', `translate(${size / 2},${size / 2})`)

  const pie = d3.pie<{ name: string; value: number }>().value(d => d.value)

  const arc = d3
    .arc<d3.PieArcDatum<{ name: string; value: number }>>()
    .innerRadius(60)
    .outerRadius(size / 2 - 10)

  const arcs = svg.selectAll('arc').data(pie(data.value)).enter().append('g')

  arcs
    .append('path')
    .attr('d', arc)
    .attr('fill', (_, index) => COLOR_CODE_LIST[index])
    .attr('stroke', 'rgba(100, 116, 139, 0.9)')
    .style('stroke-width', 2)
    .style('opacity', d => hoveredData.value && (hoveredData.value === d.data.name ? 1 : 0.2))

  arcs
    .append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .style('font-size', 15)
    .text(d => (d.data.name === 'autre' ? otherCountriesCount.value : d.value))
    .style('opacity', d => hoveredData.value && (hoveredData.value === d.data.name ? 1 : 0))

  arcs
    .append('path')
    .attr('d', arc)
    .style('opacity', 0)
    .on('mouseover', (_, d) => (hoveredData.value = d.data.name))
    .on('mouseout', () => (hoveredData.value = null))
}

watch([() => data, () => hoveredData], drawChart, { deep: true })
</script>

<template>
  <div class="flex">
    <div
      class="flex-1"
      ref="chartInstance" />
    <div class="flex-1 content-center space-y-2 text-center">
      <div
        v-if="store.flight.length"
        v-for="(item, index) in data"
        :key="index"
        @mouseover="hoveredData = item.name"
        @mouseout="hoveredData = null"
        :class="`text-sm underline-offset-1 cursor-default decoration-orange-400 ${
          hoveredData && (hoveredData === item.name ? 'underline' : 'opacity-20')
        }`">
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>
