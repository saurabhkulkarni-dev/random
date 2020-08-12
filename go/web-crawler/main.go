package main

import (
	"./crawler"
	"fmt"
	"sync"
	"strconv"
	"time"
)


func startCrawler(cr *crawler.Crawler, wg *sync.WaitGroup, initialURL string, depth int) {
	cr.Crawl(initialURL, depth, wg);
};

func main() {
	crawler := crawler.NewCrawler();
	wg := &sync.WaitGroup{}
	wg.Add(1);
	timeStart := time.Now().UnixNano();
	startCrawler(crawler, wg, "test", 4);
	wg.Wait();
	timeEnd := time.Now().UnixNano();
	timeDiff := timeEnd - timeStart;
	// without go routing 4724000 ns
	// with go routines 4750000 ns
	fmt.Println("Total time taken (in nano sec): " + strconv.FormatInt(timeDiff, 10));
}