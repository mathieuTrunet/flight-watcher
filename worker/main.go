package main

import (
	"fmt"
	"net/http"
)

func statusHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("hello"))
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func main() {
	http.HandleFunc("/hello", statusHandler)

	port := ":8080"
	if err := http.ListenAndServe(port, nil); err != nil {
		fmt.Println(err)
	}
}
