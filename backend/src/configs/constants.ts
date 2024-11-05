import path from 'path'

const SERVER_PORT = process.env.BACKEND_PORT
const WORKER_PORT = process.env.WORKER_PORT
const REDIS_PORT = process.env.REDIS_PORT

const WORKER_ENDPOINT = '/worker'
const WORKER_URL = `worker:${WORKER_PORT}${WORKER_ENDPOINT}`

const REDIS_URL = `redis://redis:${REDIS_PORT}`
const REDIS_KEY = 'flights'
const REDIS_JOB_START_CHANNEL = 'job_start'
const REDIS_JOB_END_CHANNEL = 'job_end'

const FRONTEND_DIRECTORY_PATH = path.join(__dirname, '..', '..', 'dist')

export {
  FRONTEND_DIRECTORY_PATH,
  SERVER_PORT,
  REDIS_URL,
  REDIS_JOB_START_CHANNEL,
  REDIS_JOB_END_CHANNEL,
  WORKER_URL,
  REDIS_KEY,
}
