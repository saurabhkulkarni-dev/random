const stringPermutationsUnique = inputString => {
    /*
    assuming all characters of inputString are unique.
    */
   let returnArray = [];
   if(inputString.length === 0 || inputString.length === 1) {
       returnArray.push(inputString);
   }
   else {
       let firstChar = inputString[0];
       let p1 = stringPermutationsUnique(inputString.substring(1, inputString.length));
       for(let i = 0; i < p1.length; i++) {
           for(let j = 0; j < p1[i].length; j++) {
               let leftString = p1[i].substring(0, j);
               let rightString = p1[i].substring(j, p1[i].length);
               returnArray.push(leftString + firstChar + rightString);
           }
       }
   }
   return returnArray;
}

const getStringPermutationsWithMap = (stringHashMap, prefix, remaining, result) => {
    if(remaining === 0) {
        result.push(prefix);
        return;
    }
    let mapKeys = Object.keys(stringHashMap);
    for(let i = 0; i < mapKeys.length; i++) {
        let count = stringHashMap[mapKeys[i]];
        if(count > 0) {
            stringHashMap[mapKeys[i]] = count - 1;
            getStringPermutationsWithMap(stringHashMap, prefix + mapKeys[i], remaining - 1, result);
            stringHashMap[mapKeys[i]] = count;
        }
    }
    return;
}

const stringPermutationsNotUnique = inputString => {
    let result = [];
    let stringHashMap = inputString.split('').reduce((map, el) => ((map[el] ? map[el]++ : map[el] = 1), map), {});
    getStringPermutationsWithMap(stringHashMap, '', inputString.length, result);
    return result;
}

console.log(stringPermutationsUnique('uniquestrg'));
console.log(stringPermutationsNotUnique('aaaabbcccc'));