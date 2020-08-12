package main

import (
	"./crawler"
	"sync"
)


func startCrawler(cr *crawler.Crawler, wg *sync.WaitGroup, initialURL string, depth int) {
	cr.Crawl(initialURL, depth, wg);
};

func main() {
	crawler := crawler.NewCrawler();
	wg := &sync.WaitGroup{}
	wg.Add(1);
	startCrawler(crawler, wg, "test", 4);
	wg.Wait();
}