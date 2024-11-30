import { defineStore } from 'pinia'
import { ref } from 'vue'

type CountryData = { name: string; officialName: string; population: number; populationDate: number }

export const useCountryStore = defineStore('country', () => {
  const country = ref<CountryData>()

  const setCountry = (value: CountryData) => (country.value = value)

  return { country, setCountry }
})
