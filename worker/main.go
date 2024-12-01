package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

var WORKER_PORT = os.Getenv("WORKER_PORT")
var REDIS_PORT = os.Getenv("REDIS_PORT")

const ENDPOINT_URL = "/worker"

const REDIS_JOB_START_CHANNEL = "job_start"
const REDIS_JOB_END_CHANNEL = "job_end"
const REDIS_JOB_ERROR_CHANNEL = "job_error"
const REDIS_KEY = "flights"

func main() {
	startRedis()

	go startJobReading(REDIS_JOB_START_CHANNEL)

	http.HandleFunc(ENDPOINT_URL, getWorkerData)

	fmt.Println("server open on", WORKER_PORT)

	for {
		if error := http.ListenAndServe(":"+WORKER_PORT, nil); error != nil {
			log.Printf("server error %v", error)
			time.Sleep(2 * time.Second)
		}
	}

}
