const getAllSubSets = superset => {
    /*
    we represent each possibility as a bit in the binary int between 0, 2^n
    */
    if(!superset || superset.length === 0) {
        return [];
    }
    let supersetSize = superset.length;
    /*
    1 when shifted arithmetically to n places left, yields 2^n.
    Every n elements have 2^n possibilities of being chosen or not. 
    */
    let maxPossibleSize = 1 << superset.length;
    let allSubSets = [];

    for(let j = 0; j < maxPossibleSize; j++) {
        allSubSets.push(convertIntToSubset(superset, j));
    }

    return allSubSets;
}

const convertIntToSubset = (superset, index) => {
    let returnArray = [];
    let el = 0;
    /*
    we increment array index (el) per right shift
    right shift pushes the actual set yes/no value to LSB
    LSB & 1 === 1, so we know if that's set or not. 
    */
    for(let i = index; i > 0; i >>= 1) {
        if((i & 1) === 1) {
            returnArray.push(superset[el])
        }
        el++;
    }
    return returnArray;
}

console.log(getAllSubSets([1,2,3,4]));
