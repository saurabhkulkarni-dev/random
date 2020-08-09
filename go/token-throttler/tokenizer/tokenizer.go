package tokenizer

import (
	"fmt"
	"sync"
)

const maxTokens = 10;

// Tokenizer is the wrapper class for holding tokens
type Tokenizer struct {
	availableTokens int
	totalTokens int
	currentUsers map[string]bool
	lock sync.Mutex
}

// NewTokenizer creates a new instance of tokenizer struct
func NewTokenizer() *Tokenizer {
	tokenizer := Tokenizer {
		availableTokens: maxTokens,
		totalTokens: maxTokens,
		currentUsers: make(map[string]bool),
	}
	return & tokenizer;
};

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