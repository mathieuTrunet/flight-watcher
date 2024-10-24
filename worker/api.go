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

const ENV_VARIABLE_OPENSKY_ACCOUNT_USERNAME = "OPENSKY_ACCOUNT_USERNAME"
const ENV_VARIABLE_OPENSKY_ACCOUNT_PASSWORD = "OPENSKY_ACCOUNT_PASSWORD"

func fetchExternalApi() ([]byte, error) {
	username := os.Getenv(ENV_VARIABLE_OPENSKY_ACCOUNT_USERNAME)
	password := os.Getenv(ENV_VARIABLE_OPENSKY_ACCOUNT_PASSWORD)

	if username == "" || password == "" {
		return nil, fmt.Errorf("missing env variables")
	}

	auth := base64.StdEncoding.EncodeToString([]byte(fmt.Sprintf("%s:%s", username, password)))

	apiUrl := fmt.Sprintf("%s?lamin=43.628123&lamax=51.110420&lomin=-4.240723&lomax=7.888184", OPENSKY_API_URL)

	request, err := http.NewRequest("GET", apiUrl, nil)
	if err != nil {
		return nil, err
	}

	request.Header.Add("Authorization", "Basic "+auth)

	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return nil, err
	}

	defer response.Body.Close()

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

	processedData, err := processApiData(body)
	if err != nil {
		http.Error(writer, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	jsonData, err := json.Marshal(processedData)
	if err != nil {
		http.Error(writer, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	error = storeKeyValue(REDIS_KEY, string(body))
	if error != nil {
		http.Error(writer, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", RESPONSE_HEADER_CONTENT_TYPE)
	writer.Write(jsonData)
}
