package main

import (
	"fmt"
	"log"
	"net/http"
)

const WORKER_PORT = "5000"
const REDIS_PORT = "6379"

const ENDPOINT_URL = "/worker"
const DATA_SOURCE_URL = "http://numbersapi.com/random/trivia"

const REDIS_JOB_START_CHANNEL = "job_start"
const REDIS_JOB_END_CHANNEL = "job_end"
const REDIS_KEY = "data_trivia"

func main() {
	startRedis()

	go startJobReading(REDIS_JOB_START_CHANNEL)

	http.HandleFunc(ENDPOINT_URL, Get)

	fmt.Println("server open on", WORKER_PORT)

	if error := http.ListenAndServe(":"+WORKER_PORT, nil); error != nil {
		log.Fatalf("server error %v", error)
	}
}
