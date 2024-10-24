import type { ServerWebSocket } from 'bun'
import { publishToRedis } from './redis'
import { REDIS_JOB_START_CHANNEL, REDIS_KEY } from '../configs/constants'

const SIXTEEN_SECONDS_IN_MILLISECONDS = 16_000

const activesSockets: Set<ServerWebSocket<unknown>> = new Set()

let isSocketOpen: boolean = false

export const onSocketOpen = (openedSocket: ServerWebSocket<unknown>) => {
  activesSockets.add(openedSocket)

  publishToRedis(REDIS_JOB_START_CHANNEL, REDIS_KEY)
}

export const onSocketClose = (closedSocket: ServerWebSocket<unknown>) => {
  activesSockets.delete(closedSocket)

  isSocketOpen = false
}

export const onMessageReceive = (messageSocket: ServerWebSocket<unknown>, message: string | Buffer) => {
  if (message === 'socket-on') {
    isSocketOpen = true

    if (![...activesSockets].some(socket => socket === messageSocket)) activesSockets.add(messageSocket)
  }
}

export const checkIfSocketIsOpen = () =>
  setInterval(() => {
    if (!isSocketOpen) return activesSockets.clear()

    isSocketOpen = false

    publishToRedis(REDIS_JOB_START_CHANNEL, REDIS_KEY)
  }, SIXTEEN_SECONDS_IN_MILLISECONDS)

export const sendMessageToAllSockets = (message: string) =>
  [...activesSockets].forEach(socket => socket.send(message))
