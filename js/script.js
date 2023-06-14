const MAXCALCLEN = 11;

let calcExpression = document.getElementById('calcExpression');
let calcNum = document.getElementById('calcNum');
let currentNum = 0;
let calculatedFlag = false, expressionFlag = false, notChangeFlag = false;
let dataList = [currentNum];

let getAfterDotLen = (num) => {
    if (!num.toString().includes('.'))
        return 0;
    return num.toString().split('.')[1].length;
}

// let calcPrecision = (num1, num2) => {
//     let factor = Math.max(num1.toString().length, num2.toString().length);
//     let res = (num1 * factor) / (num2 * factor);
//     return getAfterDotLen(res);
// }

let math = {
    eval: () => {
        let result = +dataList[0];
        let current = 0;
        let precision = 1;
        // let factor = 1;

        for (let i = 1; i < dataList.length; i++) {
            if(typeof dataList[i + 1] === 'string' && dataList[i+1].toString().includes('%')) {
                current = dataList[i-1] / 100 * Number.parseFloat(dataList[i+1].slice(0, -1));
            } else if(!isNaN(+dataList[i+1])) {
                current = +dataList[i+1];
            }

            if (dataList[i].toString().match(/^[+\-*/]$/)) {
                result *= 10000000;
                current *= 10000000;
            }
            switch (dataList[i]) {
                case '+' :
                    precision = Math.max(precision, getAfterDotLen(current), getAfterDotLen(result));
                    // factor = Math.max(factor)
                    result += current;
                    result /= 10000000;
                    break;
                case '-' :
                    precision = Math.max(precision, getAfterDotLen(current), getAfterDotLen(result));
                    result -= current;
                    result /= 10000000;
                    break;
                case '*' :
                    result *= current;
                    result /= 100000000000000;
                    break;
                case '/' :
                    // precision = Math.max(precision, calcPrecision(result, current));
                    result /= current;
                    break;
                case '^' :
                    // precision = Math.max(precision, calcPrecision(result, current));
                    result = Math.pow(dataList[i-1], current);
                    break;
            }
        }
        calculatedFlag = true;
        expressionFlag = true;

        // precision = Math.min(Math.max(result.toString().length - 1, 1), MAXCALCLEN) + 1;
        // result = parseFloat(result.toPrecision(precision));
        if (result.toString().length > MAXCALCLEN)
            result = result.toExponential(3);
        return result;
    }
}

let addNumber = (key) => {

    if(isNaN(calcNum.textContent) || !isFinite(calcNum.textContent) || notChangeFlag) {
        calcNum.textContent = '0';
        currentNum = 0;
        notChangeFlag = false;
    }
    if(calcExpression.textContent.indexOf('=') !== -1) {
        calcExpression.textContent = '';
        calculatedFlag = false;
    }

    currentNum = +key;


    if(key === ',' && !calcNum.textContent.includes('.', 0)) {
        calcNum.textContent += '.';
        return;
    }

    if(expressionFlag) {
        calcNum.textContent = key;
        expressionFlag = false;
        return;
    }

    if (calculatedFlag) {
        calcNum.textContent = key;
        return;
    }

    if (calcNum.textContent.length === 0)
        calcNum.textContent = currentNum;
    else if (calcNum.textContent.length < MAXCALCLEN) {
        currentNum = parseFloat(calcNum.textContent + key);
    }
    else {
        currentNum = parseFloat(calcNum.textContent);
    }

    if (key === '0' && calcNum.textContent.includes('.', 0)) {
        calcNum.innerText = calcNum.innerText + key;
    } else {
        calcNum.textContent = currentNum;
    }
}

let calcMethod = (key) => {
    expressionFlag = true;
    if(calcExpression.textContent.length === 0 || calculatedFlag) {
        calcExpression.textContent = calcNum.textContent + ' ' + key;
        dataList = [currentNum, key];
        calculatedFlag = false;
        return;
    }

    if(calcExpression.textContent.length !== 0) {
        calcExpression.textContent += ' ' + calcNum.textContent + ' =';
        dataList.push(currentNum);
        currentNum = math.eval();
        calcNum.textContent = currentNum;
        dataList = [];
    }
}

let printResult = () => {
    if (!calculatedFlag && calcExpression.textContent.length > 0) {
        calcExpression.textContent += ' ' + calcNum.textContent + " =";
        dataList.push(currentNum);
        currentNum = math.eval(calcExpression.textContent);
        calcNum.textContent = currentNum;
        dataList = [];
        notChangeFlag = true;
        addNextCookie(JSON.stringify({ expression: calcExpression.textContent, number: currentNum + "" }));
        // currentNum = 0;
    }
}


let clear = () => {
    if (notChangeFlag)
        return;

    if (currentNum !== 0) {
        if(currentNum / 10 < 1) {
            calcNum.textContent = 0;
            currentNum = 0
            return;
        }
        calcNum.textContent = calcNum.textContent.slice(0, -1);
        currentNum = parseFloat(calcNum.textContent);
    }
}

document.addEventListener('keydown', (event) => {
    let key = event.key;
    if (!isFinite(currentNum)) {
        currentNum = 0;
    }

    if (key === 'Backspace') {
        clear();
        return;
    }

    if (key === 'Enter' || key === '=') {
        printResult();
        return;
    }

    if(key.match(/^[0-9,]$/)) {
        addNumber(key);
    }

    if(key.match(/[\-*/+]/)) {
        calcMethod(key);
    }

}, false);

document.querySelector(".result-field > .slider-wrp > .switch > input").addEventListener("change", function () {
    const extendedWindow = document.querySelector(".extended-block-wrp");
    const calculator = document.querySelector(".calculator");

    if (this.checked) {
        extendedWindow.style.display = "grid";
        calculator.style.cssText += `
            grid-template-columns: 1fr 1fr;
            width: 700px;
        `;
    } else {
        extendedWindow.style.display = "none";
        calculator.style.cssText += `
            grid-template-columns: 1fr;
            width: 350px;
        `;
    }
})

document.querySelector(".close-btn").addEventListener("click", () => {
    document.querySelector(".instructions").style.display = "none";
})

document.getElementById("help").parentElement.addEventListener("click", () => {
    document.querySelector(".instructions").style.display = "flex";
})


document.querySelectorAll('.num').forEach(e => {
    e.addEventListener('click',() => {
        addNumber(e.firstChild.id.charAt(3));
    });
})

document.getElementById('negate').parentElement.addEventListener('click', () => {
    currentNum *= -1;
    calcNum.textContent = currentNum;
});

document.getElementById('pow').parentElement.addEventListener('click', () => {
    dataList.push(currentNum);
    dataList.push('^');
    dataList.push(2)
    calcExpression.textContent = currentNum + ' ^ ' + 2 + ' =';
    currentNum = math.eval();
    calcNum.textContent = currentNum;
    expressionFlag = true;
});

document.getElementById('denominator').parentElement.addEventListener('click', () => {
    if (calculatedFlag)
        calcExpression.textContent = `1/${currentNum}`;
    currentNum = 1 / currentNum;
    if (currentNum.toString().length >= MAXCALCLEN)
        currentNum = currentNum.toExponential(3);
    calcNum.textContent = currentNum;
    expressionFlag = true;
});

document.getElementById('sqrt').parentElement.addEventListener('click', () => {
    if (calculatedFlag)
        calcExpression.textContent = `sqrt(${currentNum})`;
    currentNum = Math.sqrt(currentNum);
    if (currentNum.toString().length >= MAXCALCLEN)
        currentNum = currentNum.toExponential(3);
    calcNum.textContent = currentNum;
    expressionFlag = true;
});

document.getElementById('percent').parentElement.addEventListener('click', () => {
    if (!dataList[0] || calcNum.textContent.includes('%'))
        return;
    currentNum += '%';
    if (currentNum.toString().length >= MAXCALCLEN)
        currentNum = currentNum.toExponential(3);
    calcNum.textContent = currentNum;
});

document.getElementById('CE').parentElement.addEventListener('click', () => {
    calcExpression.textContent = '';
    dataList = [currentNum];
    calculatedFlag = false;
    expressionFlag = false;
});

document.getElementById('C').parentElement.addEventListener('click', () => {
    calcExpression.textContent = '';
    calcNum.textContent = '0';
    currentNum  = 0;
    dataList = [];
    calculatedFlag = false;
    expressionFlag = false;
});

document.getElementById('dot').parentElement.addEventListener('click', () => {
    addNumber(',');
});

document.getElementById('pi').parentElement.addEventListener('click', () => {
    currentNum = Math.PI.toFixed(8);
    calcNum.textContent = currentNum;
});

document.getElementById('e').parentElement.addEventListener('click', () => {
    currentNum = 2.71828;
    calcNum.textContent = currentNum;
});

document.getElementById('powExtended').parentElement.addEventListener('click', () => {
    dataList.push(currentNum);
    dataList.push('^');
    calcExpression.textContent = currentNum + ' ^';
    expressionFlag = true;
});


document.getElementById('fact').parentElement.addEventListener('click', () => {
    if(!Number.isInteger(currentNum))
        return;

    if (calculatedFlag)
        calcExpression.textContent = `!(${currentNum})`;
    currentNum = factorialize(currentNum);
    if (currentNum.toString().length >= MAXCALCLEN)
        currentNum = currentNum.toExponential(3);
    calcNum.textContent = currentNum;
    expressionFlag = true;
});

document.getElementById('log2').parentElement.addEventListener('click', () => {
    if(currentNum < 0)
        return;

    if (calculatedFlag)
        calcExpression.textContent = `log2(${currentNum})`;
    currentNum = Math.log2(currentNum);
    if (currentNum.toString().length >= MAXCALCLEN)
        currentNum = currentNum.toExponential(3);
    calcNum.textContent = currentNum;
    expressionFlag = true;
});
document.getElementById('ln').parentElement.addEventListener('click', () => {
    if(currentNum < 0)
        return;

    if (calculatedFlag)
        calcExpression.textContent = `ln(${currentNum})`;
    currentNum = Math.log10(currentNum);
    if (currentNum.toString().length >= MAXCALCLEN)
        currentNum = currentNum.toExponential(3);
    calcNum.textContent = currentNum;
    expressionFlag = true;
});

let memory = NaN;
document.getElementById('mPlus').parentElement.addEventListener('click', () => {
    if(isNaN(memory))
        memory = 0;
    memory += currentNum;
});

document.getElementById('mMinus').parentElement.addEventListener('click', () => {
    if(isNaN(memory))
        memory = 0;
    memory -= currentNum;
});

document.getElementById('mr').parentElement.addEventListener('click', () => {
    if(isNaN(memory))
        return;

    currentNum = memory;
    calcNum.textContent = memory;
});

document.getElementById('mc').parentElement.addEventListener('click', () => {
    memory = NaN;
});

document.getElementById('convert').parentElement.addEventListener('click', () => {
    const convertElements = getSelectedElements();
    
    if (convertElements[0] === null || convertElements[1] === null)
        return;

    if (calculatedFlag)
        calcExpression.textContent = `${convertElements[0].innerText}->${convertElements[1].innerText}(${currentNum})`;
    currentNum *= Math.pow(10, convertElements[0].getAttribute('num')) * Math.pow(10, -convertElements[1].getAttribute('num'));
    if (currentNum.toString().length >= MAXCALCLEN)
        currentNum = currentNum.toExponential(3);
    calcNum.textContent = currentNum;
    expressionFlag = true;
});

document.querySelectorAll('.oper').forEach(e => {
    e.addEventListener('click', () => {
        if(e.firstChild.id === 'remove') {
            clear();
        }
        switch (e.firstChild.id) {
            case 'sum':
                calcMethod('+');
                break;
            case 'sub':
                calcMethod('-');
                break;
            case 'mul':
                calcMethod('*');
                break;
            case 'div':
                calcMethod('/');
                break;
            case 'equal':
                printResult('=');
                break;
        }
    });
})

function factorialize(num) {
    if (num < 0)
        return -1;
    else if (num === 0)
        return 1;
    else {
        return (num * factorialize(num - 1));
    }
}

function setValuesFromCookie(obj) {
    obj = JSON.parse(obj);

    calculatedFlag = true;
    expressionFlag = true;
    notChangeFlag = true;
    
    calcExpression.textContent = obj.expression;
    currentNum = obj.number;

    calcNum.textContent = currentNum;
}