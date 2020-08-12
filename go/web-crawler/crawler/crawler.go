package crawler

import (
	"fmt"
	"sync"
	"strconv"
)

func getNewUrlsFrom(url string) []string {
	//stub function to return more URLs from an URL
	stubURLs := make([]string, 5);
	for i := 0; i < 5; i++ {
		stubURLs = append(stubURLs, url+strconv.FormatInt(int64(i), 10));
	}
	return stubURLs;
};

//Crawler is the web crawler struct
type Crawler struct {
	seen map[string]bool
	lock sync.RWMutex
};

// NewCrawler returns a new instance of web crawler
func NewCrawler() *Crawler {
	return &Crawler{
		seen: make(map[string]bool),
	};
};

// Crawl is the function to crawl web pages
func (cr *Crawler) Crawl(url string, depth int, wg *sync.WaitGroup) {
	defer wg.Done();
	if depth <= 0 {
		fmt.Println("Reached max depth. Exiting.")
		return;
	}
	cr.lock.Lock();
	if _, ok := cr.seen[url]; ok {
		fmt.Println("URL is crawled already : " + url);
		cr.lock.Unlock();
		return;
	}
	fmt.Println("Crawling url : " + url);
	cr.seen[url] = true;
	cr.lock.Unlock();
	newURLs := getNewUrlsFrom(url);
	for _, url := range newURLs {
		wg.Add(1);
		cr.Crawl(url, depth - 1, wg);
	}
}