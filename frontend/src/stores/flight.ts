import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFlightStore = defineStore('flight', () => {
  const flight = ref<Array<Flight>>([])

  const selectedFlight = ref<Flight>()

  const setFlight = (newFlight: Array<Flight>) => (flight.value = [...newFlight])

  const getFlightGlobeData = () =>
    [...flight.value].map(([icao24, , longitude, latitude, on_ground, , true_track, , geo_altitude]) => ({
      name: icao24,
      lng: longitude,
      lat: latitude,
      landed: on_ground,
      rotation: true_track,
      altitude: geo_altitude,
    }))

  const setSelectedFlight = (name: string) => {
    const targetFlight = flight.value.find(([icao24]) => icao24 === name)

    selectedFlight.value = targetFlight
  }

  const getFlightByName = (name: string) => flight.value.find(([icao24]) => icao24 === name)

  return { flight, setFlight, selectedFlight, setSelectedFlight, getFlightGlobeData, getFlightByName }
})
