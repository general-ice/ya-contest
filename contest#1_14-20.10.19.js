// Task 1
// Initial decision
function solve ({ a, replace }) {
    const variants = [String(a)];

    for(let i = 0; i < String(a).length; i++) {
        for (let j = 0; j < String(a).length; j++) {
            variants.push(
                String(a).split(’’).map((char, index) => {
                if (index < i) {
                    return char;
                } else if (index > j) {
                    return char;
                } else {
                    return replace(char);
                }
            }).join(’’),
        );
        }
    }

    return Math.min(...variants.map(v => parseInt(v, 10)));
}

// Remade decision

function newSolve({ a, replace }) {
    const aStr = a.toString();
    return aStr
        .split('')
        .reduce((r, c, i) => {
            const cStr = aStr.slice(0,i) + replace(c) + aStr.slice(i + 1);
            const cNum = parseInt(cStr, 10);
            return cNum < r ? cNum : r;
        }, a)
}