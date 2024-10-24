import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useErrorStore = defineStore('error', () => {
  const error = ref<boolean>(false)

  function setError(value: boolean) {
    error.value = value
  }

  return { error, setError }
})
