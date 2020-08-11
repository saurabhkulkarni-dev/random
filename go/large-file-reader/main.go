package main

import (
	"./filereader"
	"fmt"
	"os"
	"sync"
	"strconv"
	"time"
)

const mb = 1024 * 1024;
const gb = 1024 * mb;

//OutputStats are the actual stats per second we need to emit
type OutputStats struct {
	avg200 int64
	avg500 int64
	avgOther int64
	totalRequests int64
};

//StatsCounter is wrapper around file reader
type StatsCounter struct {
	currentOffset int64
	fileName string
	fileReader *filereader.FileReader
	currentStats *OutputStats
	lock sync.RWMutex
}

//NewStatsCounter is constructor
func NewStatsCounter(fileName string) *StatsCounter {
	fileReader := filereader.NewFileReader(fileName);
	return &StatsCounter {
		currentOffset: int64(0),
		fileName: fileName,
		fileReader: fileReader,
		currentStats: &OutputStats {
			avg200: int64(0),
			avg500: int64(0),
			avgOther: int64(0),
			totalRequests: int64(0),
		},
	};
};

func (sc *StatsCounter) getStatsByDuration (duration time.Duration, stopChannel chan bool) {
	ticker := time.NewTicker(duration);
	defer ticker.Stop();

	for {
		select {
		case <- stopChannel: 
			fmt.Println("Stop signal received. Exiting..");
			return;
		case <- ticker.C:
			go sc.getStatsByOffset(stopChannel);
		}
	}
};

func (sc *StatsCounter) getStatsByOffset(stopChannel chan bool) {
	wg := sync.WaitGroup{}
	//create a monitoring channel for file reader
	fileMon := make(chan *filereader.Record);
	perThreadLimit := int64(100 * mb);
	fs, err := os.Stat(sc.fileName);
	if err != nil {
		panic(err);
	}

	fileSize := fs.Size() - sc.currentOffset;
	maxThreads := fileSize/perThreadLimit;
	if maxThreads <= 0 {
		maxThreads = 1;
	}
	//reset current stats
	sc.currentStats = &OutputStats {
		avg200: int64(0),
		avg500: int64(0),
		avgOther: int64(0),
		totalRequests: int64(0),
	};
	//read incoming records on fileMon channel and update currentstats
	go func() {
		for record := range fileMon {
			sc.lock.Lock();
			switch record.StatusCode {
			case int64(200):
				sc.currentStats.avg200++;
				break;
			case int64(500):
				sc.currentStats.avg500++;
				break;
			default:
				sc.currentStats.avgOther++;
			}
			sc.currentStats.totalRequests++;
			sc.lock.Unlock();
		}
	}()

	for i := int64(0); i < maxThreads; i++ {
		wg.Add(1); 
		nextChunk := sc.currentOffset + i * (perThreadLimit + 1);
		go func() {
			sc.fileReader.ReadRecords(nextChunk, perThreadLimit, fileMon);
			wg.Done();
		}();
	}
	wg.Wait();
	stopChannel <- true
	close(fileMon);
	fmt.Println("Records observed: ");
	fmt.Println("200s: " + strconv.FormatInt(sc.currentStats.avg200, 10));
	fmt.Println("500s: " + strconv.FormatInt(sc.currentStats.avg500, 10));
	fmt.Println("others: " + strconv.FormatInt(sc.currentStats.avgOther, 10));
	fmt.Println("total: " + strconv.FormatInt(sc.currentStats.totalRequests, 10));
}

func main() {
	statsCounter := NewStatsCounter("./bigfile.txt");
	channel := make(chan bool);
	statsCounter.getStatsByDuration(time.Second, channel);
}