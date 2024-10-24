import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFlightStore = defineStore('flight', () => {
  const flight = ref<Array<Flight>>([])

  function setFlight(newFlight: Array<Flight>) {
    flight.value = [...newFlight]
  }

  return { flight, setFlight }
})
