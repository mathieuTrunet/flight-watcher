import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useErrorStore = defineStore('error', () => {
  const error = ref<boolean>(false)

  const errorMessage = ref<string>()

  const setError = (value: boolean) => (error.value = value)

  const setErrorMessage = (message: string) => (errorMessage.value = message)

  return { error, setError, errorMessage, setErrorMessage }
})
