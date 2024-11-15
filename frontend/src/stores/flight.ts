import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFlightStore = defineStore('flight', () => {
  const flight = ref<Array<Flight>>([])

  const selectedFlight = ref<Flight>()

  function setFlight(newFlight: Array<Flight>) {
    flight.value = [...newFlight]
  }

  function getFlightGlobeData() {
    return [...flight.value].map(flight => {
      const [icao24, , longitude, latitude, on_ground, , true_track, , geo_altitude] = flight
      return {
        name: icao24,
        lng: longitude,
        lat: latitude,
        landed: on_ground,
        rotation: true_track,
        altitude: geo_altitude,
      }
    })
  }

  function setSelectedFlight(name: string) {
    const targetFlight = flight.value.find(flight => flight[0] === name)

    selectedFlight.value = targetFlight
  }

  return { flight, setFlight, selectedFlight, setSelectedFlight, getFlightGlobeData }
})
