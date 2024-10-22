package main

import (
	"fmt"
	"net/http"
)

const WORKER_PORT = "5000"

const ENDPOINT_URL = "/worker"
const EXTERNAL_API_URL = "http://numbersapi.com/random/trivia"

var print = fmt.Println
var printError = fmt.Errorf

func main() {

	http.HandleFunc(ENDPOINT_URL, get)

	print("Open on port ", WORKER_PORT)

	if err := http.ListenAndServe(":"+WORKER_PORT, nil); err != nil {
		printError("Serv error ", err)
	}
}
