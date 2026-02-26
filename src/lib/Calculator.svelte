<script>
    let display = $state("0");
    let previousValue = $state(null);
    let operator = $state(null);
    let waitingForNextValue = $state(false);

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

<div class="flex flex-col w-full h-full p-1">
    <div class="bg-base-200 text-base-content text-right p-3 rounded-lg mb-2 text-2xl font-medium border border-base-300 truncate tabular-nums" title={display}>
        {display}
    </div>

    <div class="grid grid-cols-4 gap-1 flex-1">
        <button class="btn btn-outline btn-error col-span-3 h-full text-lg font-bold" onclick={clear}>C</button>
        <button class="btn btn-ghost text-primary bg-primary/10 h-full text-xl font-bold" onclick={() => setOperator("/")}>÷</button>

        <button class="btn btn-outline text-base-content border-base-content/50 h-full text-lg  font-normal hover:bg-base-content/10" onclick={() => appendNumber(7)}>7</button>
        <button class="btn btn-outline text-base-content border-base-content/50 h-full text-lg font-normal hover:bg-base-content/10" onclick={() => appendNumber(8)}>8</button>
        <button class="btn btn-outline text-base-content border-base-content/50 h-full text-lg font-normal hover:bg-base-content/10" onclick={() => appendNumber(9)}>9</button>
        <button class="btn btn-ghost text-primary bg-primary/10 h-full text-xl font-bold" onclick={() => setOperator("*")}>×</button>

        <button class="btn btn-outline text-base-content border-base-content/50 h-full text-lg font-normal hover:bg-base-content/10" onclick={() => appendNumber(4)}>4</button>
        <button class="btn btn-outline text-base-content border-base-content/50 h-full text-lg font-normal hover:bg-base-content/10" onclick={() => appendNumber(5)}>5</button>
        <button class="btn btn-outline text-base-content border-base-content/50 h-full text-lg font-normal hover:bg-base-content/10" onclick={() => appendNumber(6)}>6</button>
        <button class="btn btn-ghost text-primary bg-primary/10 h-full text-xl font-bold" onclick={() => setOperator("-")}>-</button>

        <button class="btn btn-outline text-base-content border-base-content/50 h-full text-lg font-normal hover:bg-base-content/10" onclick={() => appendNumber(1)}>1</button>
        <button class="btn btn-outline text-base-content border-base-content/50 h-full text-lg font-normal hover:bg-base-content/10" onclick={() => appendNumber(2)}>2</button>
        <button class="btn btn-outline text-base-content border-base-content/50 h-full text-lg font-normal hover:bg-base-content/10" onclick={() => appendNumber(3)}>3</button>
        <button class="btn btn-ghost text-primary bg-primary/10 h-full text-xl font-bold" onclick={() => setOperator("+")}>+</button>

        <button class="btn btn-outline text-base-content border-base-content/50 col-span-2 h-full text-lg font-normal hover:bg-base-content/10" onclick={() => appendNumber(0)}>0</button>
        <button class="btn btn-primary col-span-2 h-full text-xl font-bold" onclick={performCalculation}>=</button>
    </div>
</div>