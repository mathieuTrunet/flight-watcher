import { APP_PORT } from './configs/constants'
import { onMessageReceive } from './services/websocket'

Bun.serve({
  port: APP_PORT,

  fetch(req, server) {
    const success = server.upgrade(req)
    if (success) return undefined

    return new Response('Hello world')
  },
  websocket: {
    async message(websocket, message) {
      onMessageReceive(websocket, message)
    },
  },

  development: Bun.env.NODE_ENV === 'development',
})
