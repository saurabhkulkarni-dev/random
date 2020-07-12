const getMagicIndex = (array, index) => {
    return findMagicIndex(array, 0, array.length - 1, index);
}

const findMagicIndex = (array, start, end, index) => {
    if(end < start) {
        return -1;
    }
    
    let mid = Math.floor((start + end)/2);
    let midValue = array[mid];
    if(midValue === index) {
        return midValue;
    }

   let leftIndex = Math.min(midValue, mid - 1);
   let left  = findMagicIndex(array, 0, leftIndex, index);

   if(left >= 0) {
       return left;
   }

   let rightIndex = Math.max(midValue, mid + 1)
   return findMagicIndex(array, rightIndex, end, index);
}