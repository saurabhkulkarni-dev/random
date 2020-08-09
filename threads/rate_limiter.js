const MAX_SIZE = 100;

class Request {
    constructor(from, timestamp) {
        this.source = from;
        this.timestamp = timestamp;
    }
}


class Connection {
    constructor(from) {
        this.source = from;
        this.requests = [];
    }

    addRequest(request) {
        //update requests
        this.updateRequests();
        if(this.requests.length < MAX_SIZE) {
            this.requests.push(request);
            return true;
        }
        else {
            console.log('Total available requests exceeded');
            return false;
        }
    }

    updateRequests() {
        let currentTime = new Date();
        // slide the window
        this.requests = this.requests.filter(request => request.timestamp >= currentTime - 10000);
    }
};


class RateLimiter {
    constructor() {
        this.connections = {};
    }
    
    addConnection(source) {
        let connection = new Connection(source);
        this.connections[source] = connection;
    }

    processRequest(request) {
        if(!this.connections[request.from]) {
            //no request from this source yet. add
            this.addConnection(request.from);
        }
        if(this.connections[request.from].addRequest(request)) {
            // request added successfully
            console.log('Request allowed');
        } else {
            console.log('Request denied');
        }
    }
}