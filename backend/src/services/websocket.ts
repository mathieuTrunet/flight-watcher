import type { ServerWebSocket } from 'bun'

export const onMessageReceive = (websocket: ServerWebSocket<unknown>, message: string | Buffer) => {
  console.log(`received : ${message}`)

  const response = {
    type: 'response',
    data: message,
  }

  websocket.send(JSON.stringify(response))
}
