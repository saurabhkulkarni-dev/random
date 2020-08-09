package main

import (
	"fmt"
	"time"
	"./ratelimiter"
)

func main() {
	rateLimiter := ratelimiter.NewWrapper(4);
	if(rateLimiter.ProcessRequest("user1")){
		fmt.Println("Request added");
		fmt.Println(rateLimiter);
	} 
	if(rateLimiter.ProcessRequest("user2")){
		fmt.Println("Request added");
		fmt.Println(rateLimiter);
	} 
	if(rateLimiter.ProcessRequest("user3")){
		fmt.Println("Request added");
		fmt.Println(rateLimiter);
	} 
	if(rateLimiter.ProcessRequest("user1")){
		fmt.Println("Request added");
		fmt.Println(rateLimiter);
	} 
	if(rateLimiter.ProcessRequest("user2")){
		fmt.Println("Request added");
		fmt.Println(rateLimiter);
	} 
	if(rateLimiter.ProcessRequest("user3")){
		fmt.Println("Request added");
		fmt.Println(rateLimiter);
	} 
	if(rateLimiter.ProcessRequest("user1")){
		fmt.Println("Request added");
		fmt.Println(rateLimiter);
	} 
	if(rateLimiter.ProcessRequest("user2")){
		fmt.Println("Request added");
		fmt.Println(rateLimiter);
	} 
	if(rateLimiter.ProcessRequest("user3")){
		fmt.Println("Request added");
		fmt.Println(rateLimiter);
	} 
	if(rateLimiter.ProcessRequest("user1")){
		fmt.Println("Request added");
		fmt.Println(rateLimiter);
	} 
	time.Sleep(3 * time.Second);
	if(rateLimiter.ProcessRequest("user1")){
		fmt.Println("Request added");
		fmt.Println(rateLimiter);
	} 
	if(rateLimiter.ProcessRequest("user2")){
		fmt.Println("Request added");
		fmt.Println(rateLimiter);
	} 
	if(rateLimiter.ProcessRequest("user4")){
		fmt.Println("Request added");
		fmt.Println(rateLimiter);
	} 
	if(rateLimiter.ProcessRequest("user4")){
		fmt.Println("Request added");
		fmt.Println(rateLimiter);
	} 
	if(rateLimiter.ProcessRequest("user4")){
		fmt.Println("Request added");
		fmt.Println(rateLimiter);
	} 
	if(rateLimiter.ProcessRequest("user1")){
		fmt.Println("Request added");
		fmt.Println(rateLimiter);
	} 
}