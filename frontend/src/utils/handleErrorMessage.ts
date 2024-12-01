import { useErrorStore } from '../stores/error'

const ERROR_MESSAGE_PREFIX = 'error'

export const isErrorMessage = (message: string) => {
  const errorPrefix = message.split(':')[0]

  return errorPrefix === ERROR_MESSAGE_PREFIX
}

export const handleErrorMessage = (errorMessage: string) => {
  const store = useErrorStore()

  store.setError(true)

  store.setErrorMessage(errorMessage.split(':')[1])
}
