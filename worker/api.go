package main

import (
	"io"
	"net/http"
)

func fetchExternalApi() ([]byte, error) {
	response, error := http.Get(DATA_SOURCE_URL)

	if error != nil {
		return nil, error
	}

	defer response.Body.Close()

	body, error := io.ReadAll(response.Body)

	if error != nil {
		return nil, error
	}

	return body, nil
}

const RESPONSE_HEADER_CONTENT_TYPE = "text/plain"

func Get(writer http.ResponseWriter, request *http.Request) {
	if request.Method != http.MethodGet {
		http.Error(writer, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	cachedData, error := getValue(REDIS_KEY)
	if error == nil {
		writer.Header().Set("Content-Type", RESPONSE_HEADER_CONTENT_TYPE)
		writer.Write([]byte(cachedData))
		return
	}

	body, error := fetchExternalApi()
	if error != nil {
		http.Error(writer, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	error = storeKeyValue(REDIS_KEY, string(body))
	if error != nil {
		http.Error(writer, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", RESPONSE_HEADER_CONTENT_TYPE)
	writer.Write(body)
}
