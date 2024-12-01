package main

import (
	ctx "context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
)

const ONE_MINUTE = 1 * time.Minute

var context = ctx.Background()
var redisClient *redis.Client

func startRedis() {
	redisClient = redis.NewClient(&redis.Options{
		Addr: "redis:" + REDIS_PORT,
		DB:   0,
	})

	_, error := redisClient.Ping(context).Result()
	if error != nil {
		fmt.Println("redis conection failed", error)
	}
}

func storeKeyValue(key string, value string) error {
	error := redisClient.Set(context, key, value, ONE_MINUTE).Err()
	if error != nil {
		return error
	}
	fmt.Println("data stored with key|value ", key)
	return nil
}

func getValue(key string) (string, error) {
	value, error := redisClient.Get(context, key).Result()
	if error == redis.Nil {
		return "", fmt.Errorf("no data with key %s", key)
	} else if error != nil {
		return "", error
	}
	return value, nil
}

func startJobReading(channel string) {
	pubsub := redisClient.Subscribe(context, channel)

	defer pubsub.Close()

	for {
		msg, error := pubsub.ReceiveMessage(context)
		if error != nil {
			fmt.Println("error receiving job ", error)
			redisClient.Publish(context, REDIS_JOB_ERROR_CHANNEL, fmt.Sprintf("error: %s", error))
			continue
		}

		fmt.Println("job received ", msg.Payload)

		body, error := fetchExternalApi()
		if error != nil {
			fmt.Println("fetch api failed ", error)
			redisClient.Publish(context, REDIS_JOB_ERROR_CHANNEL, fmt.Sprintf("error: %s", error))
			continue
		}

		processedData, error := processApiData(body)
		if error != nil {
			fmt.Println("data process failed ", error)
			redisClient.Publish(context, REDIS_JOB_ERROR_CHANNEL, fmt.Sprintf("error: %s", error))
			continue
		}

		jsonData, error := json.Marshal(processedData)
		if error != nil {
			fmt.Println("json parsing failed ", error)
			redisClient.Publish(context, REDIS_JOB_ERROR_CHANNEL, fmt.Sprintf("error: %s", error))
			continue
		}

		storeKeyValue(msg.Payload, string(jsonData))

		redisClient.Publish(context, REDIS_JOB_END_CHANNEL, fmt.Sprintf("data: ready in key %s", msg.Payload))
	}
}
