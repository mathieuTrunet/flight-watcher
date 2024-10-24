import type { ServerWebSocket } from 'bun'
import { publishToRedis } from './redis'
import { REDIS_JOB_START_CHANNEL } from '../configs/constants'

const SIXTEEN_SECONDS_IN_MILLISECONDS = 16_000

const activesSockets: Set<ServerWebSocket<unknown>> = new Set()

let isSocketOpen: boolean = false

export const onSocketOpen = (openedSocket: ServerWebSocket<unknown>) => {
  activesSockets.add(openedSocket)

  publishToRedis(REDIS_JOB_START_CHANNEL, 'data')
}

export const onSocketClose = (closedSocket: ServerWebSocket<unknown>) => {
  activesSockets.delete(closedSocket)

  isSocketOpen = false
}

export const onMessageReceive = (messageSocket: ServerWebSocket<unknown>, message: string | Buffer) => {
  if (message === 'socket-on') {
    isSocketOpen = true

    if (![...activesSockets].some(socket => socket === messageSocket)) activesSockets.add(messageSocket)

    checkIfSocketIsOpen()
  }

  const response = {
    type: 'response',
    data: message,
  }

  messageSocket.send(JSON.stringify(response))
}

const checkIfSocketIsOpen = () =>
  setTimeout(() => {
    if (!isSocketOpen) return activesSockets.clear()

    isSocketOpen = false

    publishToRedis(REDIS_JOB_START_CHANNEL, 'data')

    checkIfSocketIsOpen()
  }, SIXTEEN_SECONDS_IN_MILLISECONDS)
