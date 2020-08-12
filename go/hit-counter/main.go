package main

import (
	"sync"
)

// TimeDelta holds the class objects
type TimeDelta struct {
	timestamps []int
	hits []int
	timeRange int
	lock sync.RWMutex
};

//NewTimeDelta is the constructor
func NewTimeDelta(timeRange int) *TimeDelta {
	return &TimeDelta {
		timeRange: timeRange,
		hits: make([]int, timeRange),
		timestamps: make([]int, timeRange),
	};
}

func (td *TimeDelta) recordHit(timeStamp int) {
	index := timeStamp % td.timeRange;
	td.lock.Lock()
	defer td.lock.Unlock();
	if timeStamp == td.timestamps[index] {
		td.hits[index]++;
	} else {
		td.timestamps[index] = timeStamp;
		td.hits[index] = 1;
	}
};

func (td *TimeDelta) getHits(timeStamp int) int {
	hits := 0;
	for i := 0; i < td.timeRange; {
		if timeStamp - td.timestamps[i] < td.timeRange {
			hits += td.hits[i];
		}
		i++;
	}
	return hits;
};

func main() {
	td := NewTimeDelta(300);
	td.recordHit(200);
}