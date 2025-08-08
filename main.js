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


let calculator = {
    // represenation invariant: 
    //      numberA, numberB are positive number. 
    //      operator is function objects: add, subtract, multiply, divide, or null value
    //      readyForB is a boolean indicating calculator is ready for numberB.
    //      if readyForB is false, numberB must be null.

    LOGGING: false,
    numberA: null,
    numberB: null,
    operator: null,
    readyForB: false,

    checkRepInvariant: function(){
        let repInvariantHeld = 
            (typeof this.numberA === "number" || this.numberA === null) &&
            (typeof this.numberB === "number" || this.numberB === null) &&
            ([add, subtract, multiply, divide, null].includes(this.operator)) &&
            (typeof this.readyForB === "boolean");
        
        if (typeof this.numberA === "number"){
            repInvariantHeld = repInvariantHeld && this.numberA > 0;
        }
        if (typeof this.numberB === "number"){
            repInvariantHeld = repInvariantHeld && this.numberB > 0;
        } 
        if (!this.readyForB){
            repInvariantHeld = repInvariantHeld && (this.numberB === null); 
        }
        return repInvariantHeld;
    },

    clear: function(){
        this.numberA = null;
        this.numberB = null;
        this.operator = null;
        this.readyForB = false;
        if (this.LOGGING) {
            console.log(`calculator.checkRepInvariant: ${this.checkRepInvariant()}`); 
        }  
    },

    isCleared: function(){
        return this.numberA === null &&
            this.numberB === null &&
            this.operator === null &&
            this.readyForB === false;
    },
    
    parseNumberA: function(str){
        if (this.numberA === null && str){
            this.numberA = +str;
        }
        if (this.LOGGING) {
            console.log(`calculator.checkRepInvariant: ${this.checkRepInvariant()}`); 
        }  
    },

    parseNumberB: function(str){
        if (this.numberB === null && str && this.readyForB){
            this.numberB = +str;
        }
        if (this.LOGGING) {
            console.log(`calculator.checkRepInvariant: ${this.checkRepInvariant()}`); 
        }  
    },

    idToFunction: {
        "addButton": add,
        "minusButton": subtract,
        "multiplyButton": multiply,
        "divideButton": divide,
    },

    changeOperator: function(str){
        if (this.numberA !== null && this.numberB === null){
            this.operator = this.idToFunction[str];
        }
        if (this.LOGGING) {
            console.log(`calculator.checkRepInvariant: ${this.checkRepInvariant()}`); 
        }  
    },

    enoughOperands: function() {
        return this.numberA !== null && this.numberB !== null && this.operator !== null;
    },

    calculate: function(){
        if (this.enoughOperands()){
            const result = operate(this.operator, this.numberA, this.numberB);
            if (result === undefined){
                this.clear();
                return "Undefined result, calculator cleared.";
            }
            return result;
        } 
        this.clear();
        return "Not enough operands, calculator cleared.";
    }
}

const display = document.querySelector("#display"); 
let displayingResult = false;

const numberButtons = [...document.querySelectorAll(".numberButton")];
numberButtons.sort((buttonA, buttonB) => buttonA.id.charAt(-1) - buttonB.id.charAt(-1));

for(let i = 0; i < numberButtons.length; i++){
    numberButtons[i].addEventListener("click", () => {
        if (calculator.numberA !== null &&
            calculator.operator !== null && 
            !calculator.readyForB
        ){
            clearDisplay(display);
            calculator.readyForB = true;
        }
        if (displayingResult) {
            clearDisplay(display);
            displayingResult = false;
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
        calculator.parseNumberB(display.textContent);
        calculator.changeOperator(operatorButtonId);

        if (calculator.enoughOperands()){
            clearDisplay(display);
            display.textContent = calculator.calculate();
            calculator.clear();
            calculator.parseNumberA(display.textContent);
            calculator.changeOperator(operatorButtonId);
        }
        
    })
}

const operateButton = document.querySelector("#operateButton");
operateButton.addEventListener("click", (e) => {
    calculator.parseNumberB(display.textContent);
    clearDisplay(display);
    display.textContent = calculator.calculate();
    calculator.clear()
    displayingResult = true;
})