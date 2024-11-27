import { createClient } from 'redis'
import { REDIS_URL, WORKER_URL } from '../configs/constants'
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

export const subscribeToRedis = async (channel: string) => {
  try {
    const subscriber = redisClient.duplicate()

    await subscriber.connect()

    await subscriber.subscribe(channel, async _ => {
      const response = await fetch(WORKER_URL)

      const data = await response.text()

      socketsToMessage.forEach(socket => socket.send(data))

      socketsToMessage.clear()
    })
  } catch (error) {
    console.error('error subscribing to channel ', error)
  }
}
