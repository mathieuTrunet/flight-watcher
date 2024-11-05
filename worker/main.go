package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

var WORKER_PORT = os.Getenv("WORKER_PORT")
var REDIS_PORT = os.Getenv("REDIS_PORT")

const ENDPOINT_URL = "/worker"

const REDIS_JOB_START_CHANNEL = "job_start"
const REDIS_JOB_END_CHANNEL = "job_end"
const REDIS_KEY = "flights"

func main() {
	startRedis()

	go startJobReading(REDIS_JOB_START_CHANNEL)

	http.HandleFunc(ENDPOINT_URL, Get)

	fmt.Println("server open on", WORKER_PORT)

	if error := http.ListenAndServe(":"+WORKER_PORT, nil); error != nil {
		log.Fatalf("server error %v", error)
	}
}
