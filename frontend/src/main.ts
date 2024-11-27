import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { FlightSchema, safeJsonParse } from './utils/parseMessage'
import { useFlightStore } from './stores/flight'
import { useErrorStore } from './stores/error'
import './index.css'

const WEBSOCKET_URL = import.meta.env.VITE_WS_URL

export const websocket = new WebSocket(WEBSOCKET_URL)

websocket.onmessage = async message => {
  const flightStore = useFlightStore()
  const errorStore = useErrorStore()

  const parsedMessage = await safeJsonParse(message.data)
  if (!parsedMessage) return errorStore.setError(true)

  const validatedMessage = FlightSchema.safeParse(parsedMessage)
  if (validatedMessage.error) return errorStore.setError(true)

  setTimeout(() => websocket.send('socket-on'), 10_000)

  errorStore.setError(false)
  flightStore.setFlight(validatedMessage.data)
}

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
