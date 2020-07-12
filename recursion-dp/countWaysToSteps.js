const getTotalWaysToWrapper = (steps) => {
    let memo = [];
    for(let i = 0; i <= steps; i++){
        memo.push(0);
    }
    return getTotalWaysTo(steps, memo);
}

const getTotalWaysTo = (steps, memo) => {
    if(steps < 0) {
        return 0;
    }
    if(steps === 0) {
        return 1;
    }
    memo[steps - 1] = getTotalWaysTo(steps - 1, memo) + getTotalWaysTo(steps - 2, memo) + getTotalWaysTo(steps - 3, memo);
    return memo[steps - 1];
}

console.log(getTotalWaysToWrapper(37));




