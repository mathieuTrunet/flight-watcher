import type { ServerWebSocket } from 'bun'
import { publishToRedis } from './redis'
import { REDIS_JOB_START_CHANNEL, REDIS_KEY } from '../configs/constants'

export const socketsToMessage: Set<ServerWebSocket<unknown>> = new Set()

export const onSocketOpen = (openedSocket: ServerWebSocket<unknown>) => {
  socketsToMessage.add(openedSocket)

  publishToRedis(REDIS_JOB_START_CHANNEL, REDIS_KEY)
}

export const onMessageReceive = (messagingSocket: ServerWebSocket<unknown>, message: string | Buffer) => {
  if (message !== 'socket-on') return

  socketsToMessage.add(messagingSocket)

  publishToRedis(REDIS_JOB_START_CHANNEL, REDIS_KEY)
}
