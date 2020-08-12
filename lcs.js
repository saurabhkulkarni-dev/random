//longest common subsequence 

const get_lcs = (seq1, seq2) => {
    if(seq1.length === 0 || seq2.length ===0) {
        return "";
    }
    const m = seq1.length;
    const n = seq2.length;
    let lcs = [];
    for (let i = 0; i <= m; i++) {
        let arr = [];
        for(let j = 0; j <= n; j++) {
            arr.push(0);
        }
        lcs.push(arr);
    }
    
    for(let i = 0; i <= m; i++) {
        for(let j = 0; j <= n; j++) {
            if(i === 0 || j === 0) {
                lcs[i][j] = 0
            } else {
                if(seq1[i - 1] === seq2[j - 1]) {
                    lcs[i][j] = 1 + lcs[i - 1][j -1]
                } else {
                    lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
                }
            }
        }
    }
    let actual_lcs = [];

    i = m;
    j = n;

    while(i > 0 && j > 0) {
        if(seq1[i - 1] === seq2[j-1]) {
            actual_lcs.unshift(seq1[i - 1]);
            i--;
            j--;
        } else {
            if(lcs[i - 1][j] > lcs[i][j-1]) {
                i--;
            }else {
                j--;
            }
        }
    }
    return actual_lcs.join('');  
};


console.log(get_lcs("asdbscbeecefd", "abcd"));
