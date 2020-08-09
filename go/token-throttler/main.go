package main

import (
	"./tokenizer"
	"fmt"
	"sync"
	"strconv"
	"time"
)

func getToken(user string, tok *tokenizer.Tokenizer, wg * sync.WaitGroup) {
	defer wg.Done();
	if(tok.RequestToken(user)) {
		fmt.Println("Token requested successfully for user: " + user);
		time.Sleep(4 * time.Second);
		tok.DepositToken(user);
		return;
	} 
	fmt.Println("Token denied for user " + user);
	fmt.Println("Returning empty handed");
	return;	
}

func main() {
	tokenizer := tokenizer.NewTokenizer();
	var wg sync.WaitGroup;
	wg.Add(50);
	
	for i := 0; i < 50; i++ {
		user := strconv.FormatInt(int64(i), 10);
		time.Sleep(1 * time.Second);
		go getToken(user, tokenizer, &wg);
	}

	wg.Wait();
	tokenizer.StopTokenizer();
	fmt.Println("Done!");
}