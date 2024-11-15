package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

const OPENSKY_API_URL = "https://api.opensky-network.org/api/states/all"
const REQUEST_PARAMETERS = "?lamin=43.628123&lamax=51.110420&lomin=-4.240723&lomax=7.888184"

func fetchExternalApi() ([]byte, error) {
	username := os.Getenv("OPENSKY_ACCOUNT_USERNAME")
	password := os.Getenv("OPENSKY_ACCOUNT_PASSWORD")

	if username == "" || password == "" {
		return nil, fmt.Errorf("missing env variables")
	}

	authentication := base64.StdEncoding.EncodeToString([]byte(fmt.Sprintf("%s:%s", username, password)))

	requestUrl := fmt.Sprintf("%s%s", OPENSKY_API_URL, REQUEST_PARAMETERS)

	request, error := http.NewRequest("GET", requestUrl, nil)
	if error != nil {
		return nil, error
	}

	request.Header.Add("Authorization", "Basic "+authentication)

	client := &http.Client{}
	response, error := client.Do(request)
	if error != nil {
		return nil, error
	}

	defer response.Body.Close()

	if response.StatusCode == http.StatusTooManyRequests {
		return nil, fmt.Errorf("api limit reached %d", response.StatusCode)
	}

	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("api fetch failed %d", response.StatusCode)
	}

	body, error := io.ReadAll(response.Body)

	if error != nil {
		return nil, error
	}

	return body, nil
}

const RESPONSE_HEADER_CONTENT_TYPE = "application/json"

func getWorkerData(writer http.ResponseWriter, request *http.Request) {
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

	processedData, error := processApiData(body)
	if error != nil {
		http.Error(writer, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	jsonData, error := json.Marshal(processedData)
	if error != nil {
		http.Error(writer, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	error = storeKeyValue(REDIS_KEY, string(jsonData))
	if error != nil {
		http.Error(writer, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", RESPONSE_HEADER_CONTENT_TYPE)
	writer.Write(jsonData)
}
