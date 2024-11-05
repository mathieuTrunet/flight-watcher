<script setup lang="ts">
import Globe, { GlobeInstance } from 'globe.gl'
import { ref, onMounted, watch } from 'vue'
import { useFlightStore } from '../stores/flight'

const GLOBE_LAYOUT_URL = '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'

const GLOBE_BACKGROUND_IMAGE_URL = '//unpkg.com/three-globe/example/img/night-sky.png'

const getMarker = (
  rotation: number
) => `<svg height="16px" width="16px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 46.876 46.876" xml:space="preserve" transform="rotate(${rotation})">
<g>
	<path style="fill:#00FF00;" d="M26.602,24.568l15.401,6.072l-0.389-4.902c-10.271-7.182-9.066-6.481-14.984-10.615V2.681
		c0-1.809-1.604-2.701-3.191-2.681c-1.587-0.021-3.19,0.872-3.19,2.681v12.44c-5.918,4.134-4.714,3.434-14.985,10.615l-0.39,4.903
		l15.401-6.072c0,0-0.042,15.343-0.006,15.581l-5.511,3.771v2.957l7.044-2.427h3.271l7.046,2.427V43.92l-5.513-3.771
		C26.644,39.909,26.602,24.568,26.602,24.568z"/>
</g>
</svg>`

const store = useFlightStore()

const getPointsData = () =>
  [...store.flight].map(flight => ({
    name: flight.icao24,
    lat: flight.latitude,
    lng: flight.longitude,
    rotate: flight.true_track,
  }))

const globeDiv = ref<HTMLDivElement | null>(null)

let myGlobe: GlobeInstance

const setGlobe = () => {
  if (globeDiv.value) {
    myGlobe = Globe()
    myGlobe(globeDiv.value)
      .pointOfView({ lat: 47.397456350353366, lng: 2.8154561348203804, altitude: 0.7 })
      .globeImageUrl(GLOBE_LAYOUT_URL)
      .backgroundImageUrl(GLOBE_BACKGROUND_IMAGE_URL)

      .pointsData(getPointsData())
  }
}

watch(
  () => store.flight,
  () => {
    if (myGlobe) {
      myGlobe.htmlElementsData(getPointsData()).htmlElement(data => {
        const element = document.createElement('div')

        element.innerHTML = getMarker(data.rotate)

        element.style.pointerEvents = 'auto'

        element.style.cursor = 'pointer'

        element.onclick = () => {
          store.setSelectedFlight(data.name)
        }

        return element
      })
    }
  }
)

onMounted(setGlobe)
</script>

<template>
  <div ref="globeDiv"></div>
</template>

<style scoped lang="scss">
div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
}
</style>
