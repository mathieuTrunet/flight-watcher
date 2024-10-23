import { createClient } from 'redis'
import { REDIS_URL } from '../configs/constants'

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

    await subscriber.subscribe(channel, message => console.log(`received message ${channel}: ${message}`))
  } catch (error) {
    console.error('error subscribing to channel ', error)
  }
}
