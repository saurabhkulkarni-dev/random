package ratelimiter

import (
	"fmt"
	"time"
)

// NewWrapper acts like a contructor for Ratelimiter
func NewWrapper(maxReq int) RateLimitter {
	rateLimiter := RateLimitter {
		connections: make(map[string]*Connection),
		windowDuration: time.Second,
		maxRequestsPerWindow: maxReq,
	};
	return rateLimiter;
};

// NewConnection returns a new connection object 
func NewConnection(userID string, window time.Duration) *Connection {
	connection := Connection {
		userID: userID,
		requests: make(map[int64]int),
		currentCount: 0,
		currentTimestamps: make([]int64, 10),
		signal: make(chan bool),
	};
	return &connection;
};

// SlideWindow slides the window every second
func (conn *Connection) SlideWindow(window time.Duration) {
	ticker := time.NewTicker(2 * time.Second);
	defer ticker.Stop();
	fmt.Println("Sliding window start for user " + conn.userID);
	for {
        select {
		case <- conn.signal:
			fmt.Println("End signal received");
            return;
		case <- ticker.C:
			fmt.Println("Tick")
			conn.updateRequests(int64(window));
        }
    }
}

func (conn * Connection) updateRequests(window int64) {
	timeNow := time.Now().Unix();
	conn.lock.Lock();
	defer conn.lock.Unlock();
	i := 0;
	deletedRequests := 0;
	for(timeNow - conn.currentTimestamps[i] >= window) {
		deletedRequests += conn.requests[conn.currentTimestamps[i]];
		delete(conn.requests, conn.currentTimestamps[i]);
		i++;
	}
	conn.currentTimestamps = conn.currentTimestamps[i:];
	conn.currentCount -= deletedRequests;
	if(conn.currentCount < 0) {
		fmt.Println("Sending signal")
		conn.currentCount = 0;
		conn.signal <- false;
	}
}

func (conn *Connection) getCurrentCount() int {
	conn.lock.Lock();
	defer conn.lock.Unlock();
	return conn.currentCount;
};

func (conn *Connection) addRequest() {
	timestamp := time.Now().Unix();
	conn.lock.Lock();
	defer conn.lock.Unlock();
	var requests int;
	if val, ok := conn.requests[timestamp]; ok {
		requests = val;
	} else {
		requests = 0;
	}
	requests++;
	conn.requests[timestamp] = requests;
	conn.currentCount++;
	lastTimestamp := conn.currentTimestamps[len(conn.currentTimestamps)-1];
	if(timestamp - lastTimestamp != 0) {
		conn.currentTimestamps = append(conn.currentTimestamps, timestamp);
	}
};

//ProcessRequest processes incoming request from a user
func (rl RateLimitter) ProcessRequest (userID string) bool {
	//check of connection exists for this user
	var userConn *Connection;
	if _, ok := rl.connections[userID]; ok {
		userConn = rl.connections[userID];
	} else {
		userConn = NewConnection(userID, rl.windowDuration);
		rl.connections[userID] = userConn;
	}
	requestCount := userConn.getCurrentCount();
	if(requestCount > rl.maxRequestsPerWindow) {
		fmt.Println("Request limit exceeded for user " + userID);
		return false;
	}
	userConn.addRequest();
	if(requestCount == 0) {
		// first request. start the sliding window
		go userConn.SlideWindow(rl.windowDuration);
	}
	return true;
}