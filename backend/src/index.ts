import { REDIS_JOB_END_CHANNEL, SERVER_PORT } from './configs/constants'
import { connectToRedis, subscribeToRedis } from './services/redis'
import { onMessageReceive, onSocketOpen, onSocketClose, checkIfSocketIsOpen } from './services/websocket'

await connectToRedis()

await subscribeToRedis(REDIS_JOB_END_CHANNEL)

Bun.serve({
  port: SERVER_PORT,

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

checkIfSocketIsOpen()
