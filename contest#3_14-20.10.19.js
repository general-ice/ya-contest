// The barcode has a fixed size - 148 by 156 pixels. Along the perimeter of the barcode are black and white frames of 3 pixels each.
//     Inside the frames is the barcode content, consisting of 18 lines of 17 black or white squares per line. The size of each square is 8 by 8 pixels.
//     White squares in the content encode 0, black - 1.
// Barcode Content Generation Algorithm
// At the intersection of the first row and the first column of content, a square is drawn that encodes the gender of the clone. The value of female is encoded by zero (white), male by one (black).
//     Further, a line of the form <id> <name> is formed from the fields id and name. The name field is padded with spaces at the end of up to 26 characters.
//     The resulting string is converted into a byte array - each character of the string is assigned the corresponding ASCII code (a number from 0 to 255).
// Then, each element of the resulting array is translated into binary notation (eight symmols 0 or 1) and encoded by a sequence of eight squares (0 - white quartrate, 1 - black square). Squares are drawn in the barcode content sequentially and line by line.
//     The last line of content contains control information.
//     Control Information Counting Algorithm
// Each square in the line of control information determines the parity of the sum of the content values ​​in the corresponding column. If the sum of zeros and ones in the column is even, then a white square is drawn in the control information; otherwise, a black square is drawn.

const encodedStrLength = 26;

function renderBarcode({ id, name, sex }, element) {
    setInitialStyle(element);
    const colMap = Array(17)
        .fill(0);
    const completedName = definedStrTo(name, encodedStrLength);
    const dataStr = id + completedName;
    const assciStr = dataStr
        .split("")
        .map((_, i) => dataStr.charCodeAt(i));
    const binaryStrList = assciStr
        .map(s => s.toString(2))
        .map(defineStrToByte);
    const binaryList = [
        sex === "male",
        ...binaryStrList
            .flatMap(i => [...i]
                .map(i => !!parseInt(i, 10)))
    ];
    for (let i = 0; i < 17; i++) {
        const row = binaryList.slice(17 * i, (i + 1) * 17);
        row.forEach((v, i) => {
            colMap[i] = v ? colMap[i] + 1 : colMap[i];
        });
        const rowEls = getRow(row);
        element.appendChild(rowEls);
    }
    const controlRow = colMap.map(i => Math.abs(i) % 2 !== 0);
    element.appendChild(getRow(controlRow));
}

const getSquare = isFilled => {
    const el = document.createElement("div");
    styledComponent(el, {
        width: "8px",
        height: "8px",
        float: "left",
        backgroundColor: isFilled && "black",
    })
    return el;
};

const styledComponent = (el, styles) => {
    for (const style in styles) {
        el.style[style] = styles[style];
    }
    return el;
}

const defineStrToByte = str => {
    return str.length === 8
        ? str
        : [...getSymbols("0", 8 - str.length), ...str].join("");
};

const setInitialStyle = (el) => {
    styledComponent(el, {
        border: '3px solid black',
        boxSizing: 'border-box',
        padding: '3px'
    });
}

const getSymbols = (char, size) => new Array(size).fill(char);

const definedStrTo = (str, size) => {
    return str.length === size
        ? str
        : str + getSymbols(" ", size - str.length)
        .join("");
};

const getRow = isFilledList => {
    const row = document.createElement("div");
    styledComponent(row, {clear: 'both'})
    isFilledList.forEach(i => row.appendChild(getSquare(i)));
    return row;
};

const test = () => {
    const [firstTest, secondTest] = [
        {
            sex: "female",
            id: "0owrgqqwfw",
            name: "Dazdraperma Petrovna"
        }, {
            sex: "male",
            id: "c5j818dyo5",
            name: "Oleg Vladimirovich"
        }
    ];

    renderBarcode(firstTest, document.getElementById("code"));
}