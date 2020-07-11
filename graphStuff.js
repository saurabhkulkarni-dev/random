const CONNECTOR = '->';
const prompt = require('prompt-sync')({sigint: true});
const util = require('util');

class Node {
    constructor(params) {
        this.value = params.value;
        this.links = params.links ? params.links : [];
    }

    linkTo(node) {
        if(!node) {
            return null;
        }
        // check if this node exists as a link already
        if(this.links.filter(el => el.value === node.value).length === 1) {
            console.log('This node exists as a link already.')
        } else {
            this.links.push(node);
        }
        return;
    }
}

class Graph {

    constructor() {
        this.nodes = {};
    }

    addNode(value) {
        if(value) {
            // check if node exists
            if(this.nodes[value]) {
                console.log('This node exists already. Exiting.');
                return;
            }
            this.nodes[value] = new Node({value})
        } else {
            return null;
        }
    }

    addLink(from, to) {
        if(from && to) {
            if(!this.nodes[from]) {
                console.log('From node does not exist. Exiting.');
                return;
            }
            if(!this.nodes[to]) {
                // if to node does not exist, make one.
                this.nodes[to] = new Node({value: to});
            }
            this.nodes[from].linkTo(this.nodes[to]);
            return;
        } else {
            return null;
        }
    }

    getRoute(from, to) {
        if(from && to) {
            if(this.nodes[from] && this.nodes[to]) {
                // check for a direct link
                if(this.nodes[from].links.includes(this.nodes[to])) {
                    return 'Direct path found : ' + this.nodes[from].value + CONNECTOR + this.nodes[to].value;
                }
                // get route.
                let visitedNodes = {};
                return this._getBestPossibleRoute(this.nodes[from], this.nodes[to], visitedNodes);
            } else {
                console.log('Both nodes need to exist! Exiting.');
                return null;
            }
        } else {
            console.log('Bad node values.');
            return null;
        }
    }

    _getBestPossibleRoute(nodeFrom, nodeTo, visitedNodes) {
        visitedNodes[nodeFrom.value] = true;
        if(nodeFrom.links.includes(nodeTo)){
            return nodeFrom.value.toString() + CONNECTOR + nodeTo.value.toString();
        }
        let shortestPath = null;
        for(let i = 0 ; i < nodeFrom.links.length; i++) {
            if(!visitedNodes[nodeFrom.links[i].value]) {
                let path = this._getBestPossibleRoute(nodeFrom.links[i], nodeTo, visitedNodes);
                if(path !== null) {
                    if(!shortestPath) {
                        shortestPath = nodeFrom.value + CONNECTOR + path;
                    }
                    else {
                        let currentLength = shortestPath.split(CONNECTOR).length;
                        let newLength = path.split(CONNECTOR).length + 1;
                        if(newLength < currentLength) {
                            shortestPath = nodeFrom.value + CONNECTOR + path;
                        }
                    }
                }
            }
        }
        return shortestPath;
    }
}

console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
console.log('Welcome to Graph Simulator!')
console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')

let testGraph = new Graph();

while(true) {
    console.log('1. Add a Node')
    console.log('2. Add a Link')
    console.log('3. Get a route')

    let choice = prompt('Enter your choice: ');
    let nextPrompt = '';
    let params = ''

    switch(Number(choice)) {
        case 1: nextPrompt = prompt('Enter the node value: ');
                testGraph.addNode(Number(nextPrompt));
                console.log('Added!');
                break;
        case 2: nextPrompt = prompt('Add Link => Enter from, to node values (comma separated): ');
                params = nextPrompt.split(',');
                if(params.length !== 2) {
                    console.log('Need two values!');
                    break;
                }
                testGraph.addLink(Number(params[0]), Number(params[1]));
                console.log('Done!');
                break;
        case 3: nextPrompt = prompt('Get Routes => Enter from, to node values (comma separated): ');
                params = nextPrompt.split(',');
                if(params.length !== 2) {
                    console.log('Need two values!');
                    break;
                }
                console.log(testGraph.getRoute(Number(params[0]), Number(params[1])));
                console.log('Done!');
                break;
        default:console.log('Here is your graph for reference: ');
                console.log(util.inspect(testGraph));
                break;
    }
}
