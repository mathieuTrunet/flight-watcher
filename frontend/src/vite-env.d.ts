/// <reference types="vite/client" />

type Flight = [
  icao24: string,
  origin_country: string,
  longitude: number,
  latitude: number,
  on_ground: boolean,
  velocity: number | null,
  true_track: number | null,
  vertical_rate: number | null,
  geo_altitude: number | null,
  squawk: string | null
]
