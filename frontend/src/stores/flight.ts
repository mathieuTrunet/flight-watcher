import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFlightStore = defineStore('flight', () => {
  const flight = ref<Array<Flight>>([])

  const selectedFlight = ref<Flight>()

  function setFlight(newFlight: Array<Flight>) {
    flight.value = [...newFlight]
  }

  function setSelectedFlight(name: string) {
    const targetFlight = flight.value.find(flight => flight.icao24 === name)

    selectedFlight.value = targetFlight
  }

  return { flight, setFlight, selectedFlight, setSelectedFlight }
})
