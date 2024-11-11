<script setup lang="ts">
import Globe, { GlobeInstance } from 'globe.gl'
import { ref, onMounted, watch } from 'vue'
import { useFlightStore } from '../stores/flight'
import Plane from './Plane'

const GLOBE_IMAGE_PATH = '/earth-dark.jpg'
const GLOBE_BACKGROUND_IMAGE_PATH = '/night-sky.webp'
const COUNTRIES_DATA_PATH = '/countries-dataset.geojson'

const GLOBE_STARTING_POINT_OF_VIEW_PARAMETERS = { lat: 47.397456350353366, lng: 2.8154561348203804, altitude: 0.7 }

const store = useFlightStore()

const globeDiv = ref<HTMLDivElement | null>(null)
let globeInstance: GlobeInstance

const initializeGlobe = () => {
  if (!globeDiv.value) return
  globeInstance = Globe()
  globeInstance(globeDiv.value)
    .globeImageUrl(GLOBE_IMAGE_PATH)
    .backgroundImageUrl(GLOBE_BACKGROUND_IMAGE_PATH)
    .pointOfView(GLOBE_STARTING_POINT_OF_VIEW_PARAMETERS)
    .pointsData(store.getFlightGlobeData())
    .polygonCapColor(() => 'rgba(0, 0, 0, 0)')
    .polygonStrokeColor(() => 'rgba(255, 141, 0, 0.7)')
    .polygonSideColor(() => 'rgba(255, 141, 0, 0.2)')
    .onPolygonHover(data => {
      //data && console.log(data.properties.ADMIN)
      globeInstance.polygonCapColor(same => (same === data ? 'rgba(255, 141, 0, 0.1)' : 'rgba(0, 0, 0, 0)'))
    })
}

const setGlobeHtmlElements = (data: any) => {
  const element = document.createElement('div')
  element.innerHTML = Plane({ rotation: data.rotation })
  element.style.pointerEvents = 'auto'
  element.style.cursor = 'pointer'
  element.onclick = () => store.setSelectedFlight(data.name)
  return element
}

watch(
  () => store.flight,
  () => {
    if (!globeInstance) return
    globeInstance.htmlElementsData(store.getFlightGlobeData()).htmlElement(setGlobeHtmlElements)
  }
)

onMounted(initializeGlobe)

onMounted(async () => {
  const response = await fetch(COUNTRIES_DATA_PATH)
  const countriesData = await response.json()

  globeInstance
    .polygonsData(countriesData.features.filter((d: any) => d.properties.ISO_A2 !== 'AQ'))
    .polygonAltitude(0.007)
})
</script>

<template>
  <div
    class="absolute z-1 top-0 left-0 w-[100vw] h-[100vh]"
    ref="globeDiv" />
</template>
