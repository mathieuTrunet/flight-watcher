package main

import (
	"encoding/json"
)

const STATE_VECTOR_LENGTH = 17
const STATE_VECTOR_LONGITUDE_INDEX = 5
const STATE_VECTOR_LATITUDE_INDEX = 6

const STATE_VECTOR_CALLSIGN_INDEX = 1
const STATE_VECTOR_TIME_POSITION_INDEX = 3
const STATE_VECTOR_LAST_CONTACT_INDEX = 4
const STATE_VECTOR_BARO_ALTITUDE_INDEX = 7
const STATE_VECTOR_SENSORS_INDEX = 12
const STATE_VECTOR_SPI_INDEX = 15
const STATE_VECTOR_POSITION_SOURCE_INDEX = 16

type StateVector []interface{}

type ApiResponse struct {
	Time   int           `json:"time"`
	States []StateVector `json:"states"`
}

var removedStateVectorIndex = map[int]struct{}{
	STATE_VECTOR_CALLSIGN_INDEX:        {},
	STATE_VECTOR_TIME_POSITION_INDEX:   {},
	STATE_VECTOR_LAST_CONTACT_INDEX:    {},
	STATE_VECTOR_BARO_ALTITUDE_INDEX:   {},
	STATE_VECTOR_SENSORS_INDEX:         {},
	STATE_VECTOR_SPI_INDEX:             {},
	STATE_VECTOR_POSITION_SOURCE_INDEX: {},
}

func processApiData(data []byte) ([]StateVector, error) {
	parsedResponse, error := parseApiResponse(data)

	if error != nil {
		return nil, error
	}

	filteredStates := filterStates(parsedResponse.States)

	parsedStates := parseStates(filteredStates)

	return parsedStates, nil
}

func parseApiResponse(data []byte) (ApiResponse, error) {
	var response ApiResponse

	if error := json.Unmarshal(data, &response); error != nil {
		return ApiResponse{}, error
	}

	return response, nil
}

func filterStates(states []StateVector) []StateVector {
	var filteredStates []StateVector

	for _, state := range states {
		if len(state) == STATE_VECTOR_LENGTH && state[STATE_VECTOR_LONGITUDE_INDEX] != nil && state[STATE_VECTOR_LATITUDE_INDEX] != nil {
			filteredStates = append(filteredStates, state)
		}
	}

	return filteredStates
}

func parseStates(states []StateVector) []StateVector {
	var parsedStates []StateVector

	for _, state := range states {
		var parsedState StateVector

		for index, value := range state {
			if _, remove := removedStateVectorIndex[index]; !remove {
				parsedState = append(parsedState, value)
			}
		}

		parsedStates = append(parsedStates, parsedState)
	}

	return parsedStates
}
