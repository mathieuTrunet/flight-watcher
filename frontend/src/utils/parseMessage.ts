import * as z from 'zod'

export const FlightSchema = z.array(
  z.object({
    icao24: z.string(),
    callsign: z.string().nullable().optional(),
    origin_country: z.string(),
    time_position: z.number().nullable().optional(),
    last_contact: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
    latitude: z.number().nullable().optional(),
    baro_altitude: z.number().nullable().optional(),
    on_ground: z.boolean(),
    velocity: z.number().nullable().optional(),
    true_track: z.number().nullable().optional(),
    vertical_rate: z.number().nullable().optional(),
    sensors: z.array(z.number()).nullable().optional(),
    geo_altitude: z.number().nullable().optional(),
    squawk: z.string().nullable().optional(),
    spi: z.boolean(),
    position_source: z.number(),
  })
)

export const safeJsonParse = async (data: string) =>
  new Promise<any | false>((resolve, reject) => {
    try {
      const parsedJson = JSON.parse(data)

      resolve(parsedJson)
    } catch {
      reject(false)
    }
  })
