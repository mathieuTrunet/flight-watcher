import * as z from 'zod'

export const FlightSchema = z.array(
  z.tuple([
    z.string(),
    z.string(),
    z.number(),
    z.number(),
    z.boolean(),
    z.number().nullable(),
    z.number().nullable(),
    z.number().nullable(),
    z.number().nullable(),
    z.string().nullable(),
  ])
)

export const safeJsonParse = (data: string) =>
  new Promise<any[] | false>((resolve, reject) => {
    try {
      const parsedJson = JSON.parse(data)

      resolve(parsedJson)
    } catch {
      reject(false)
    }
  })
