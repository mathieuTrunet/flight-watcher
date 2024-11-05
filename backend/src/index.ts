import { REDIS_JOB_END_CHANNEL, SERVER_PORT } from './configs/constants'
import { connectToRedis, subscribeToRedis } from './services/redis'
import { onMessageReceive, onSocketOpen, onSocketClose, checkIfSocketIsOpen } from './services/websocket'
import handleRequest from './services/server'

await connectToRedis()

await subscribeToRedis(REDIS_JOB_END_CHANNEL)

Bun.serve({
  port: SERVER_PORT,

  fetch(request, server) {
    return handleRequest(request, server)
  },

  error() {
    return new Response('', { status: 404 })
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

checkIfSocketIsOpen()
