const getPossibleParentheses = count => {
    /*
    given a count of left/right parentheses available, 
    generate all possible valid combos.
    A combo is valid arithmetical expression
    */

    if(!count) {
        return [];
    }

    let returnList = [];
    let stringCombo = [];
    generateParenthesisExample(stringCombo, count, count, returnList, 0);
    return returnList;
};

const generateParenthesisExample = (stringCombo, leftParens, rightParens, returnList, count) => {
    if(leftParens < 0 || rightParens < leftParens) {
        // invalid state
        return;
    }
    if(leftParens === 0 && rightParens === 0) {
        let stringToPush = new String(stringCombo);
        returnList.push(stringToPush);
        return;
    }
    if(leftParens > 0) {
        stringCombo[count] = '(';
        generateParenthesisExample(stringCombo, leftParens - 1, rightParens, returnList, count + 1);
    }
    if(rightParens > leftParens) {
        stringCombo[count] = ')';
        generateParenthesisExample(stringCombo, leftParens, rightParens - 1, returnList, count + 1);
    }
};

console.log(getPossibleParentheses(3));