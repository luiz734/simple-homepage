<script>
    let display = "0";
    let previousValue = null;
    let operator = null;
    let waitingForNextValue = false;

    function appendNumber(number) {
        if (waitingForNextValue) {
            display = String(number);
            waitingForNextValue = false;
        } else {
            display = display === "0" ? String(number) : display + number;
        }
    }

    function setOperator(nextOperator) {
        const inputValue = parseFloat(display);

        if (previousValue === null) {
            previousValue = inputValue;
        } else if (operator) {
            const result = calculate(previousValue, inputValue, operator);
            display = String(result);
            previousValue = result;
        }

        waitingForNextValue = true;
        operator = nextOperator;
    }

    function calculate(first, second, op) {
        if (op === "+") return first + second;
        if (op === "-") return first - second;
        if (op === "*") return first * second;
        if (op === "/") return first / second;
        return second;
    }

    function performCalculation() {
        if (operator === null || waitingForNextValue) return;

        display = String(calculate(previousValue, parseFloat(display), operator));
        previousValue = null;
        operator = null;
        waitingForNextValue = false;
    }

    function clear() {
        display = "0";
        previousValue = null;
        operator = null;
        waitingForNextValue = false;
    }
</script>

<div class="calculator">
    <div class="display">{display}</div>
    <div class="buttons">
        <button on:click={clear} class="col-span-3">C</button>
        <button on:click={() => setOperator("/")}>÷</button>

        <button on:click={() => appendNumber(7)}>7</button>
        <button on:click={() => appendNumber(8)}>8</button>
        <button on:click={() => appendNumber(9)}>9</button>
        <button on:click={() => setOperator("*")}>×</button>

        <button on:click={() => appendNumber(4)}>4</button>
        <button on:click={() => appendNumber(5)}>5</button>
        <button on:click={() => appendNumber(6)}>6</button>
        <button on:click={() => setOperator("-")}>-</button>

        <button on:click={() => appendNumber(1)}>1</button>
        <button on:click={() => appendNumber(2)}>2</button>
        <button on:click={() => appendNumber(3)}>3</button>
        <button on:click={() => setOperator("+")}>+</button>

        <button on:click={() => appendNumber(0)} class="col-span-2">0</button>
        <button on:click={performCalculation} class="col-span-2">=</button>
    </div>
</div>

<style>
    .calculator {
        width: 100%;
        /*max-width: 300px;*/
        background: #222;
        padding: 10px;
        border-radius: 8px;
    }

    .display {
        background: #444;
        color: white;
        font-size: 2rem;
        text-align: right;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 4px;
        height: 3rem;
        overflow: hidden;
    }

    .buttons {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 5px;
    }

    button {
        padding: 15px;
        font-size: 1.2rem;
        border: none;
        background: #666;
        color: white;
        cursor: pointer;
        border-radius: 4px;
    }

    button:hover {
        background: #888;
    }

    .col-span-2 {
        grid-column: span 2;
    }

    .col-span-3 {
        grid-column: span 3;
    }
</style>