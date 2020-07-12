const prompt = require('prompt-sync')({sigint: true});

const POSITION = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
};

const ERROR = -999;
const LOWINT = -9999;
const HIGHINT = 9999;

class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }

    insertLeftChild(node) {
        if(!this.left) {
            this.left = node;
        } else {
            console.log('Left child exists already!');
            return false;
        }
        return true;
    }

    insertRightChild(node) {
        if(!this.right) {
            this.right = node;
        } else {
            console.log('Right child exists already!');
            return false;
        }
        return true;
    }
}

class Tree {

    constructor(value) {
        this.root = new TreeNode(value);
        this.nodes = {};
        this.nodes[value] = this.root;
    }

    getNode(value) {
        return this.nodes[value];
    }

    insertChildByPosition(parent, child, position) {
        if(!parent || !position || !child) {
            console.log('Parent/Child/Position is missing.')
            return null;
        }
        let node = this.getNode(parent)
        if(!node) {
            console.log('Cannot find the specified value!');
            return null;
        }
        let childNode = new TreeNode(child);

        switch(position) {
            case POSITION.LEFT: 
                if(node.insertLeftChild(childNode)) {
                    console.log('Added!');
                    this.nodes[child] = childNode;
                } 
                break;
            case POSITION.RIGHT: 
                if(node.insertRightChild(childNode)) {
                    console.log('Added!');
                    this.nodes[child] = childNode;
                } 
                break;
            default: console.log('Bad position value specified');
                     break;
        }
    }

    printDepthWise() {
        let depthWiseLists = [];
        let traversalQueue = [this.root];

        while(traversalQueue.length > 0) {
            depthWiseLists.push(traversalQueue.map(el => el.value));
            let newQueue = []
            for(let i = 0; i < traversalQueue.length; i++) {
                if(traversalQueue[i].left) {
                    newQueue.push(traversalQueue[i].left);
                }
                if(traversalQueue[i].right) {
                    newQueue.push(traversalQueue[i].right);
                }
            }
            traversalQueue = newQueue;
        }
        return depthWiseLists;
    }

    checkIfBalanced() {
        return this._isBalanced(this.root) !== ERROR;
    }

    _isBalanced(node) {
        if(!node) {
            return -1;
        }
        let lHeight = this._isBalanced(node.left);
        if(lHeight === ERROR) {
            return ERROR;
        }
        let rHeight = this._isBalanced(node.right);
        if(rHeight === ERROR) {
            return ERROR;
        }
        let heightDiff = Math.abs(lHeight - rHeight);
        return heightDiff > 1 ? ERROR : Math.max(lHeight, rHeight) + 1;
    }

    checkIfBST() {
        return this._isBST(this.root);
    }

    _isBST(node) {
        if(!node) {
            return true;
        }
        let lSubTreeBST = this._isBST(node.left);
        if(!lSubTreeBST){
            return false;
        }
        let rSubTreeBST = this._isBST(node.right);
        if(!rSubTreeBST){
            return false;
        }

        let lValue = node.left ? node.left.value : LOWINT;
        let rValue = node.right ? node.right.value : HIGHINT;

        return lValue <= node.value && node.value <= rValue; 
    }

    getCommonAncestor(val1, val2) {
        let node1 = this.getNode(val1);
        let node2 = this.getNode(val2);
        if(!node1 || !node2) {
            console.log('Node does not exist!');
            return null;
        }
        let parentNode = this.root;
        let iteratorNode = parentNode;
        while(iteratorNode !== null) {
            if(this._contains(iteratorNode.left, val1) && this._contains(iteratorNode.left, val2)){
                iteratorNode = iteratorNode.left;
                parentNode = iteratorNode;
            }else if(this._contains(iteratorNode.right, val1) && this._contains(iteratorNode.right, val2)){
                iteratorNode = iteratorNode.right;
                parentNode = iteratorNode;
            }else {
                iteratorNode = null;
            }    
        }
        return parentNode.value;
    }

    _contains(node, value) {
        if(node.value === value) {
            return true;
        }
        let lContains = false;
        let rContains = false;
        if(node.left) {
            lContains = this._contains(node.left, value);
        } 
        if(node.right) {
            rContains = this._contains(node.right, value);
        }
        return lContains || rContains; 
    }
    
}

console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
console.log('Welcome to Tree Simulator!')
console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')

let testTree = null

while(true) {
    console.log('1. Add Root (starts afresh)')
    console.log('2. Add a left child')
    console.log('3. Add a Right child')
    console.log('4. Get depth wise lists')
    console.log('5. Check if the tree is balanced')
    console.log('6. Check if the tree is BST')
    console.log('7. Get the most common ancestor')

    let choice = prompt('Enter your choice: ');
    let nextPrompt = '';
    let params = ''

    switch(Number(choice)) {
        case 1: nextPrompt = prompt('Enter the node value: ');
                testTree = new Tree(Number(nextPrompt));
                console.log('Added!');
                break;
        case 2: nextPrompt = prompt('Add Left child => Enter parent, child node values (comma separated): ');
                params = nextPrompt.split(',');
                if(params.length !== 2) {
                    console.log('Need two values!');
                    break;
                }
                testTree.insertChildByPosition(Number(params[0]), Number(params[1]), POSITION.LEFT);
                console.log('Done!');
                break;
        case 3: nextPrompt = prompt('Add Right child => Enter parent, child node values (comma separated): ');
                params = nextPrompt.split(',');
                if(params.length !== 2) {
                    console.log('Need two values!');
                    break;
                }
                testTree.insertChildByPosition(Number(params[0]), Number(params[1]), POSITION.RIGHT);
                console.log('Done!');
                break;
        case 4: if(!testTree) {
                    console.log('Tree does not exist!');
                } else {
                    console.log(testTree.printDepthWise());
                }
                break;
        case 5: if(!testTree) {
                    console.log('Tree does not exist!');
                } else {
                    console.log('Balance status: ')
                    console.log(testTree.checkIfBalanced());
                }
                break;
        case 6: if(!testTree) {
                    console.log('Tree does not exist!');
                } else {
                    console.log('BST status: ')
                    console.log(testTree.checkIfBST());
                }
                break;
        case 7: if(!testTree) {
                    console.log('Tree does not exist!');
                } else {
                    nextPrompt = prompt('Enter node values, comma separated: ');
                    params = nextPrompt.split(',');
                    if(params.length !== 2) {
                        console.log('Please input two params!');
                        break;
                    }
                    if(Number(params[0]) == Number(params[1])){
                        console.log('Please enter different values!');
                        break;
                    }
                    console.log(testTree.getCommonAncestor(Number(params[0]), Number(params[1])));
                }
                break;
        default:console.log('Here is your tree for reference: ');
                console.log(JSON.stringify(testTree));
                break;
    }
}
