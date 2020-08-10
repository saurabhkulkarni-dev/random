package tokenizer

import (
	"fmt"
	"sync"
	"time"
)

const maxTokens = 10;

// Tokenizer is the wrapper class for holding tokens
type Tokenizer struct {
	availableTokens int
	totalTokens int
	currentUsers map[string]bool
	lock sync.RWMutex
	signal chan bool
}

// NewTokenizer creates a new instance of tokenizer struct
func NewTokenizer() *Tokenizer {
	tokenizer := Tokenizer {
		availableTokens: maxTokens,
		totalTokens: maxTokens,
		currentUsers: make(map[string]bool),
		signal: make(chan bool),
	}
	go tokenizer.refreshTokens();
	return &tokenizer;
};

//refresh tokens adds 2 more tokens to available tokens every five seconds
func (tok * Tokenizer) refreshTokens() {
	ticker := time.NewTicker(5 * time.Second);
	defer ticker.Stop();

	for {
		select {
		case <- tok.signal:
			fmt.Println("Received signal to stop. Ending auto token refresh.")
			return;
		case <- ticker.C:	
			fmt.Println("********* Adding more tokens **********");
			tok.lock.Lock();
			tok.availableTokens += 2;
			tok.totalTokens += 2;
			tok.lock.Unlock();
		}
	}
}

// RequestToken checks for available token and assigns it to a user
func (tok *Tokenizer) RequestToken(user string) bool {
	tok.lock.Lock();
	defer tok.lock.Unlock();
	if(tok.availableTokens > 0) {
		fmt.Println("Assigning a token for user : " + user);
		tok.availableTokens--;
		tok.currentUsers[user] = true;
		return true;
	} 
	fmt.Println("No available tokens! Denying request for user " + user);
	return false;
};

// DepositToken returns a previously held token from the user
func (tok *Tokenizer) DepositToken(user string) {
	tok.lock.Lock();
	defer tok.lock.Unlock();
	tok.availableTokens++;
	fmt.Println("Token deposited by user " + user);
	delete(tok.currentUsers, user);
};

// StopTokenizer stops the tokenizer
func (tok * Tokenizer) StopTokenizer() {
	tok.signal <- true;
}