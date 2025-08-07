function add(a, b){
    return a + b;
}

function subtract(a, b){
    return a - b;
}

function multiply(a, b){
    return a * b;
}

function divide(a, b){
    return b !== 0 ? a / b : undefined;
}

function operate(fn, a, b){
    return fn(a, b);
}

let numberA = 0;
let numberB = 0;
let operator = null;