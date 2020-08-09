package ratelimiter;

import (
	"sync"
	"time"
)

//Connection is a link between source user & request
type Connection struct {
	userID string;
	requests map[int64]int;
	currentCount int;
	currentTimestamps []int64;
	lock sync.Mutex;
	signal chan bool;
}

//RateLimitter is the actual class that throttles requests/time range for a given user
type RateLimitter struct {
	connections map[string]*Connection;
	windowDuration time.Duration;
	maxRequestsPerWindow int;
}