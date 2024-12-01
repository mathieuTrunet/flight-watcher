import { createClient } from 'redis'
import { REDIS_JOB_END_CHANNEL, REDIS_JOB_ERROR_CHANNEL, REDIS_URL, WORKER_URL } from '../configs/constants'
import { socketsToMessage } from './websocket'

const redisClient = createClient({ url: REDIS_URL })

redisClient.on('error', err => console.error('redis error ', err))

export const connectToRedis = async () => await redisClient.connect()

export const publishToRedis = async (channel: string, message: string) => {
  try {
    await redisClient.publish(channel, message)

    console.log(`published job to channel ${channel}: ${message}`)
  } catch (error) {
    console.error('error publishing job:', error)
  }
}

const subscribeToRedis = async (channel: string, onMessageReceive: (message?: string) => void) => {
  try {
    const subscriber = redisClient.duplicate()

    await subscriber.connect()

    await subscriber.subscribe(channel, onMessageReceive)
  } catch (error) {
    console.error('error subscribing to channel ', error)
  }
}

export const subscribeToJobEnd = async () => {
  const onJobEndMessage = async () => {
    const response = await fetch(WORKER_URL)

    const data = await response.text()

    socketsToMessage.forEach(socket => socket.send(data))

    socketsToMessage.clear()
  }

  subscribeToRedis(REDIS_JOB_END_CHANNEL, onJobEndMessage)
}

export const subscribeToJobError = async () => {
  const onJobErrorMessage = async (errorMessage?: string) => {
    socketsToMessage.forEach(socket => socket.send(errorMessage!))

    socketsToMessage.clear()
  }

  subscribeToRedis(REDIS_JOB_ERROR_CHANNEL, onJobErrorMessage)
}
