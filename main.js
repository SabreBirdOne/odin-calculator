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
    return b !== 0 ? Math.round(a / b * 100000) / 100000 : undefined;
}

function operate(fn, a, b){
    return fn(a, b);
}

function clearDisplay(display){
    display.textContent = '';
}



// Abstraction: 

//      user enters a number with digit pad into display.textContent.
//      When user enters an operator: "+", "-", "*", "/":
//      
//      if numberA is null: 
//          calculator parses display.textContent as numberA
//      else if numberA is filled and numberB is null (picking the operator)
//          calculator parses the operator as calculator.operator
//      
//      When user enters the "=" button:
//      if numberA, numberB and operator are all filled, then operate() on them.
//      then pass the result to display.textContent and numberA.
//      numberB = null.

//      
let calculator = {
    // represenation invariant: 
    //      numberA, numberB are positive number. 
    //      operator is function objects: add, subtract, multiply, divide, or null value
    //      readyForB is a boolean indicating calculator is ready for numberB.

    //      States:
    //          null everything: = does nothing. +-*/ parses non-empty display.textContent into numberA and changes calculator.operator
    //          numberA is filled but not numberB: = does nothing. +-*/ changes calculator.operator
    //          if numberA and operator are filled, and a digit button is pressed, clearDisplay() (display.textContent), and fill it with the digit just pressed.
    //          numberA and numberB is filled: 
    //              = sends operate() result to display.textContent
    //              +-*/ sends operate() result to numberA, and nulls calculator.operator


    numberA: null,
    numberB: null,
    operator: null,
    readyForB: false,

    clear: function(){
        this.numberA = null;
        this.numberB = null;
        this.operator = null;
        this.readyForB = false;
    },
    
    parseNumberA: function(str){
        if (this.numberA === null){
            this.numberA = +str;
        }
    },

    idToFunction: {
        "addButton": add,
        "minusButton": subtract,
        "multiplyButton": multiply,
        "divideButton": divide,
    },

    changeOperator: function(str){
        if (this.numberA !== null){
            this.operator = this.idToFunction[str];
        }
    },
}

const display = document.querySelector("#display"); 

const numberButtons = [...document.querySelectorAll(".numberButton")];
numberButtons.sort((buttonA, buttonB) => buttonA.id.charAt(-1) - buttonB.id.charAt(-1));

for(let i = 0; i < numberButtons.length; i++){
    numberButtons[i].addEventListener("click", () => {
        if (calculator.numberA !== null && calculator.operator !== null && !calculator.readyForB){
            clearDisplay(display);
            calculator.readyForB = true;
        }
        display.textContent += `${i}`;
    });
}

const clearButton = document.querySelector("#clearButton");
clearButton.addEventListener("click", () => {
    clearDisplay(display);
    calculator.clear()
})

const operatorButtons = [...document.querySelectorAll(".operatorButton")];

for(operatorButton of operatorButtons){
    let operatorButtonId = operatorButton.id;
    operatorButton.addEventListener("click", (e) => {
        calculator.parseNumberA(display.textContent);
        calculator.changeOperator(operatorButtonId);
    })
}
