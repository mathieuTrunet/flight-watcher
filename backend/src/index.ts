import { APP_PORT } from './configs/constants'
import { connectToRedis, subscribeToRedis } from './services/redis'
import { onMessageReceive, onSocketOpen, onSocketClose } from './services/websocket'

await connectToRedis()

await subscribeToRedis('job_done')

Bun.serve({
  port: APP_PORT,

  fetch(req, server) {
    const success = server.upgrade(req)

    if (success) return undefined

    return new Response('Hello world!')
  },

  websocket: {
    open(websocket) {
      onSocketOpen(websocket)
    },

    close(websocket) {
      onSocketClose(websocket)
    },

    async message(websocket, message) {
      onMessageReceive(websocket, message)
    },
  },

  development: Bun.env.NODE_ENV === 'development',
})
