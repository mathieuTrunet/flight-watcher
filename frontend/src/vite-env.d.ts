/// <reference types="vite/client" />

type Flight = {
  icao24: string
  callsign?: string | null
  origin_country: string
  time_position?: number | null
  last_contact?: number | null
  longitude?: number | null
  latitude?: number | null
  baro_altitude?: number | null
  on_ground: boolean
  velocity?: number | null
  true_track?: number | null
  vertical_rate?: number | null
  sensors?: Array<number> | null
  geo_altitude?: number | null
  squawk?: string | null
  spi: boolean
  position_source: number
}
