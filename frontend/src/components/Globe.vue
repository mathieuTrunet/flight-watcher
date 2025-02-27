<script setup lang="ts">
import Globe, { GlobeInstance } from 'globe.gl'
import { ref, onMounted, watch } from 'vue'
import { useFlightStore } from '../stores/flight'
import Plane from './Plane'
import { useCountryStore } from '../stores/country'

const DATA_REQUEST_DELAY_MILLISECONDS = 10_000

const GLOBE_IMAGE_PATH = '/src/assets/earth-dark.jpg'
const GLOBE_BACKGROUND_IMAGE_PATH = '/src/assets/night-sky.webp'
const COUNTRIES_DATA_PATH = '/src/assets/countries-dataset.geojson'

const GLOBE_STARTING_POINT_OF_VIEW_PARAMETERS = { lat: 47.397456350353366, lng: 2.8154561348203804, altitude: 0.7 }
const MAX_ALTITUDE_METERS = 10000
const NORMALIZED_ALTITUDE = 0.05

const TRANSPARENT_COLOR_CODE = 'rgba(0, 0, 0, 0)'
const PRIMARY_BORDER_COLOR_CODE = 'rgba(255, 141, 0, 0.2)'
const SECONDARY_BORDER_COLOR_CODE = 'rgba(255, 141, 0, 0.7)'
const COUNTRY_HOVER_COLOR_CODE = 'rgba(255, 141, 0, 0.1)'
const BORDER_ALTITUDE = 0.007

const flightStore = useFlightStore()
const countryStore = useCountryStore()

const globeDiv = ref<HTMLDivElement | null>(null)
let globeInstance: GlobeInstance
let isFirstDataSet = false

const initializeGlobe = () => {
  if (!globeDiv.value) return
  globeInstance = Globe()
  globeInstance(globeDiv.value)
    .globeImageUrl(GLOBE_IMAGE_PATH)
    .backgroundImageUrl(GLOBE_BACKGROUND_IMAGE_PATH)
    .pointOfView(GLOBE_STARTING_POINT_OF_VIEW_PARAMETERS)
    .polygonSideColor(() => PRIMARY_BORDER_COLOR_CODE)
    .polygonStrokeColor(() => SECONDARY_BORDER_COLOR_CODE)
    .polygonCapColor(() => TRANSPARENT_COLOR_CODE)
    .showGraticules(true)
    .htmlTransitionDuration(DATA_REQUEST_DELAY_MILLISECONDS)
    .htmlElement(setGlobeHtmlElements)
    .htmlAltitude(normalizeHtmlAltitude)
    .onPolygonHover(data => {
      data && setSelectedCountry(data)
      globeInstance.polygonCapColor(same => (same === data ? COUNTRY_HOVER_COLOR_CODE : TRANSPARENT_COLOR_CODE))
    })
}

const setSelectedCountry = (data: any) => {
  const { ADMIN: name, FORMAL_EN: officialName, POP_EST: population, POP_YEAR: populationDate } = data.properties
  countryStore.setCountry({ name, officialName, population, populationDate })
}

const setGlobeHtmlElements = (data: any) => {
  const element = document.createElement('div')
  element.innerHTML =
    flightStore.selectedFlight?.[0] === data.name
      ? Plane({ rotation: data.rotation, state: 'selected' })
      : Plane({ rotation: data.rotation, ...(data.landed && { state: 'landed' }) })
  element.style.pointerEvents = 'auto'
  element.style.cursor = 'pointer'
  element.onclick = () => {
    flightStore.setSelectedFlight(data.name)
    element.innerHTML = Plane({ rotation: data.rotation, state: 'selected' })
  }
  return element
}

const normalizeHtmlAltitude = (data: any) => (data.altitude / MAX_ALTITUDE_METERS) * NORMALIZED_ALTITUDE

watch(
  () => flightStore.flight,
  () => {
    if (isFirstDataSet) return
    if (!globeInstance) return
    isFirstDataSet = true
    globeInstance.htmlElementsData(flightStore.getFlightGlobeData())
  }
)

const setHtmlTravelLatitude = (data: any) => flightStore.getFlightByName(data.name)?.[3] || data.lat
const setHtmlTravelLongitude = (data: any) => flightStore.getFlightByName(data.name)?.[2] || data.lng
const setHtmlTravelALtitude = (data: any) => {
  updateSelectedFlight(data)
  const targetedFlight = flightStore.getFlightByName(data.name)
  if (!targetedFlight) return data.altitude
  if (!targetedFlight[8]) return 0
  return (targetedFlight[8] / MAX_ALTITUDE_METERS) * NORMALIZED_ALTITUDE
}
const updateSelectedFlight = (data: any) => {
  if (flightStore.selectedFlight?.[0] === data.name) flightStore.setSelectedFlight(data.name)
}

watch(
  () => flightStore.flight,
  () => {
    if (!globeInstance) return
    globeInstance.htmlLat(setHtmlTravelLatitude)
    globeInstance.htmlLng(setHtmlTravelLongitude)
    globeInstance.htmlAltitude(setHtmlTravelALtitude)

    setTimeout(
      () => globeInstance.htmlElementsData(flightStore.getFlightGlobeData()),
      DATA_REQUEST_DELAY_MILLISECONDS
    )
  }
)

onMounted(initializeGlobe)

onMounted(async () => {
  const response = await fetch(COUNTRIES_DATA_PATH)
  const countriesData = await response.json()

  globeInstance
    .polygonsData(countriesData.features.filter((data: any) => data.properties.ISO_A2 !== 'AQ'))
    .polygonAltitude(BORDER_ALTITUDE)
})
</script>

<template>
  <div
    class="absolute z-1 top-0 left-0 w-[100vw] h-[100vh]"
    ref="globeDiv" />
</template>
