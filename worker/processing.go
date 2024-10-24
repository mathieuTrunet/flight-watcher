package main

import (
	"encoding/json"
	"fmt"
	"regexp"
)

type StateVector struct {
	Icao24         string   `json:"icao24"`
	Callsign       *string  `json:"callsign"`
	OriginCountry  string   `json:"origin_country"`
	TimePosition   *int64   `json:"time_position"`
	LastContact    int64    `json:"last_contact"`
	Longitude      *float64 `json:"longitude"`
	Latitude       *float64 `json:"latitude"`
	BaroAltitude   *float64 `json:"baro_altitude"`
	OnGround       bool     `json:"on_ground"`
	Velocity       *float64 `json:"velocity"`
	TrueTrack      *float64 `json:"true_track"`
	VerticalRate   *float64 `json:"vertical_rate"`
	Sensors        []int    `json:"sensors"`
	GeoAltitude    *float64 `json:"geo_altitude"`
	Squawk         *string  `json:"squawk"`
	Spi            bool     `json:"spi"`
	PositionSource int      `json:"position_source"`
}

func process(states [][]interface{}) ([]map[string]interface{}, error) {
	icao24Regex := regexp.MustCompile("^[0-9a-fA-F]{6}$")

	var result []map[string]interface{}

	for _, state := range states {
		icao24, ok := state[0].(string)
		if !ok || !icao24Regex.MatchString(icao24) {
			continue
		}

		stateMap := make(map[string]interface{})

		stateMap["icao24"] = icao24

		if callsign, ok := state[1].(string); ok {
			stateMap["callsign"] = callsign
		}

		if originCountry, ok := state[2].(string); ok {
			stateMap["origin_country"] = originCountry
		}

		if timePosition, ok := state[3].(float64); ok {
			stateMap["time_position"] = int64(timePosition)
		}

		if lastContact, ok := state[4].(float64); ok {
			stateMap["last_contact"] = int64(lastContact)
		}

		if longitude, ok := state[5].(float64); ok {
			stateMap["longitude"] = longitude
		}

		if latitude, ok := state[6].(float64); ok {
			stateMap["latitude"] = latitude
		}

		if baroAltitude, ok := state[7].(float64); ok {
			stateMap["baro_altitude"] = baroAltitude
		}

		if onGround, ok := state[8].(bool); ok {
			stateMap["on_ground"] = onGround
		}

		if velocity, ok := state[9].(float64); ok {
			stateMap["velocity"] = velocity
		}

		if trueTrack, ok := state[10].(float64); ok {
			stateMap["true_track"] = trueTrack
		}

		if verticalRate, ok := state[11].(float64); ok {
			stateMap["vertical_rate"] = verticalRate
		}

		if sensors, ok := state[12].([]int); ok {
			stateMap["sensors"] = sensors
		}

		if geoAltitude, ok := state[13].(float64); ok {
			stateMap["geo_altitude"] = geoAltitude
		}

		if squawk, ok := state[14].(string); ok {
			stateMap["squawk"] = squawk
		}

		if spi, ok := state[15].(bool); ok {
			stateMap["spi"] = spi
		}

		if positionSource, ok := state[16].(float64); ok {
			stateMap["position_source"] = int(positionSource)
		}

		result = append(result, stateMap)
	}

	return result, nil
}

func processApiData(rawData []byte) ([]map[string]interface{}, error) {
	var stateVectorsResponse struct {
		States [][]interface{} `json:"states"`
	}
	if err := json.Unmarshal(rawData, &stateVectorsResponse); err != nil {
		return nil, fmt.Errorf("data json parsing failed %v", err)
	}

	processedData, err := process(stateVectorsResponse.States)
	if err != nil {
		return nil, fmt.Errorf("data process failed %v", err)
	}

	return processedData, nil
}
