const START = 'START';

class PrefixTrie {

	constructor(letter) {
    this.value = letter ? letter : START;
    this.count = 0;
    this.children = {};
  }
  
  insert(word) {
  	if(!word || word.length === 0) {
    	return null;
    }
    
    let nodeIterator = this;
    let letterIterator = 0;
    
    while(letterIterator < word.length) {
    	if(!nodeIterator.children[word[letterIterator]]) {
        	//child doesn't exist. Create one
          nodeIterator.children[word[letterIterator]] = new PrefixTrie(word[letterIterator]);
        }
        // get ahead in the word
        nodeIterator = nodeIterator.children[word[letterIterator]];
        letterIterator++;
    }// while ends
  }// insert ends
  
  findIndex(word) {
  	if(!word || word.length === 0) {
  		return null;
  	}
  	let nodeIterator = this;
    let letterIterator = 0;
    while(letterIterator < word.length) {
    	if(nodeIterator.children[word[letterIterator]]) {
        nodeIterator = nodeIterator.children[word[letterIterator]];
      	letterIterator++;
      }
      else {
      	console.log('No match found!');
        return null;
      }
    }
    return nodeIterator;
  }
  
  getChildrenOf(word) {
  	let childrenBuffer = [];
  	if(!word || word.length === 0) {
    	return childrenBuffer;
    }
    let indexNode = this.findIndex(word);
    const indexChildren = Object.keys(indexNode.children);
    for(let i = 0; i < indexChildren.length; i++) {
    	let nextChildren = indexNode.children[indexChildren[i]].getChildrenFrom();
      for(let j = 0; j < nextChildren.length; j++) {
      	childrenBuffer.push(word + nextChildren[j]);
      }
    }
    return childrenBuffer;
  }
  
  getChildrenFrom() {
  	let prefix= this.value;
    const totalChildren = Object.keys(this.children);
    if(totalChildren.length === 0) {
    	//no more children
      return prefix;
    } else {
      let nextChildren = [];
    	for(let i = 0; i < totalChildren.length; i++) {
      	nextChildren.push(this.children[totalChildren[i]].getChildrenFrom());
      }
      return nextChildren.map(el => prefix + el);
    }
  }
  
}

class WordTrie {
	
  constructor() {
  	this.wordBank = new PrefixTrie();
  }
  
  insertWord(word) {
  	return this.wordBank.insert(word);
  }
  
  findWord(word) {
  	if(this.wordBank.findIndex(word)) {
    	console.log('Match found!');
    } else {
    	console.log('Word not found');
    }
    return;
  }
  
  getPredictions(word) {
  	return this.wordBank.getChildrenOf(word);
  }
 
}


/*
** tests

let testTrie = new WordTrie();
testTrie.insertWord('hello');
testTrie.insertWord('hat');
testTrie.insertWord('her');
testTrie.insertWord('to');
testTrie.insertWord('tea');
testTrie.insertWord('ted');
testTrie.insertWord('ten');
testTrie.insertWord('inn');
testTrie.insertWord('insert');
testTrie.insertWord('yes');
testTrie.insertWord('yell');
testTrie.insertWord('yeoman');


console.log('Find hello: ')
testTrie.findWord('hello');
console.log('Find hell: ')
testTrie.findWord('hell');
console.log('Find bat: ')
testTrie.findWord('bat');
console.log('Find has: ')
testTrie.findWord('has');

console.log('Get predictions for he-');
console.log(testTrie.getPredictions('he'));

console.log('Get predictions for te-');
console.log(testTrie.getPredictions('te'));

console.log('Get predictions for ye-');
console.log(testTrie.getPredictions('ye'));

console.log('Get predictions for in-');
console.log(testTrie.getPredictions('in'));
*/
