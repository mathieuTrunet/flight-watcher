import express from 'express'

const app = express()

app.get('/api/hello', (_req, res) => {
  res.send('hello')
})

app.listen(4000)