import { REDIS_JOB_END_CHANNEL, SERVER_PORT } from './configs/constants'
import { connectToRedis, subscribeToRedis } from './services/redis'
import { onMessageReceive, onSocketOpen } from './services/websocket'
import handleHttpRequest from './services/http'

await connectToRedis()

await subscribeToRedis(REDIS_JOB_END_CHANNEL)

Bun.serve({
  port: SERVER_PORT,

  fetch(request, server) {
    if (server.upgrade(request)) return undefined

    return handleHttpRequest(request)
  },

  error() {
    return new Response('', { status: 404 })
  },

  websocket: {
    open(websocket) {
      onSocketOpen(websocket)
    },

    async message(websocket, message) {
      onMessageReceive(websocket, message)
    },
  },
})
