package main

import (
	"io"
	"net/http"
)

func fetchExternalApi() ([]byte, error) {
	response, error := http.Get(EXTERNAL_API_URL)

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

func get(writer http.ResponseWriter, request *http.Request) {
	if request.Method != http.MethodGet {
		http.Error(writer, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body, error := fetchExternalApi()

	if error != nil {
		http.Error(writer, "Internal server error", http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", "text/plain")

	writer.Write(body)
}
