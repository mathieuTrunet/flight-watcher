import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const WEBSOCKET_URL = import.meta.env.VITE_WS_URL

const FIVE_SECONDS_IN_MILLISECONDS = 8_000

export const websocket = new WebSocket(WEBSOCKET_URL)

websocket.onopen = () => setInterval(() => websocket.send('socket-on'), FIVE_SECONDS_IN_MILLISECONDS)

createApp(App).mount('#app')
