<script>
    // Svelte 5 Runes for local state
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

<div class="calculator">
    <div class="display" title={display}>{display}</div>
    <div class="buttons">
        <button onclick={clear} class="secondary col-span-3">C</button>
        <button onclick={() => setOperator("/")} class="operator">÷</button>

        <button onclick={() => appendNumber(7)} class="number">7</button>
        <button onclick={() => appendNumber(8)} class="number">8</button>
        <button onclick={() => appendNumber(9)} class="number">9</button>
        <button onclick={() => setOperator("*")} class="operator">×</button>

        <button onclick={() => appendNumber(4)} class="number">4</button>
        <button onclick={() => appendNumber(5)} class="number">5</button>
        <button onclick={() => appendNumber(6)} class="number">6</button>
        <button onclick={() => setOperator("-")} class="operator">-</button>

        <button onclick={() => appendNumber(1)} class="number">1</button>
        <button onclick={() => appendNumber(2)} class="number">2</button>
        <button onclick={() => appendNumber(3)} class="number">3</button>
        <button onclick={() => setOperator("+")} class="operator">+</button>

        <button onclick={() => appendNumber(0)} class="number col-span-2">0</button>
        <button onclick={performCalculation} class="primary col-span-2">=</button>
    </div>
</div>

<style>
    .calculator {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        padding: 0 4px 4px 4px; /* Slight padding inside the widget card */
        font-family: var(--ring-font);
    }

    .display {
        background: var(--ring-input-bg, #191919);
        color: var(--ring-text);
        font-size: 24px;
        text-align: right;
        padding: 8px 12px;
        margin-bottom: 8px;
        border: 1px solid var(--ring-border);
        border-radius: var(--ring-radius);

        /* Ensure text doesn't overflow horizontally */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-variant-numeric: tabular-nums;
        font-weight: 500;
    }

    .buttons {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 4px; /* Tighter gap for Ring UI look */
        flex-grow: 1; /* Fill remaining height */
    }

    button {
        /* Reset & Base */
        appearance: none;
        border: 1px solid var(--ring-border);
        background-color: transparent;
        color: var(--ring-text);
        font-family: inherit;
        font-size: 14px;
        border-radius: var(--ring-radius);
        cursor: pointer;
        transition: all 0.15s ease-in-out;

        /* Center content */
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Interaction States */
    button:hover {
        border-color: var(--ring-text-secondary);
        background-color: rgba(255, 255, 255, 0.05);
    }

    button:active {
        background-color: rgba(255, 255, 255, 0.1);
        transform: translateY(1px);
    }

    /* Variant: Numbers (Default) */
    .number {
        font-weight: 500;
    }

    /* Variant: Operators (Accent color for visual hierarchy) */
    .operator {
        color: var(--ring-primary);
        background-color: rgba(53, 140, 246, 0.1);
        border-color: transparent;
        font-weight: 700;
        font-size: 16px;
    }
    .operator:hover {
        background-color: rgba(53, 140, 246, 0.2);
    }

    /* Variant: Primary Action (=) */
    .primary {
        background-color: var(--ring-primary);
        border-color: var(--ring-primary);
        color: white;
        font-weight: 700;
        font-size: 16px;
    }
    .primary:hover {
        background-color: var(--ring-primary-hover);
        border-color: var(--ring-primary-hover);
    }

    /* Variant: Secondary Action (Clear) */
    .secondary {
        color: var(--ring-error, #c22731);
        border-color: transparent;
    }
    .secondary:hover {
        background-color: rgba(194, 39, 49, 0.1);
        border-color: var(--ring-error);
    }

    /* Grid Spans */
    .col-span-2 { grid-column: span 2; }
    .col-span-3 { grid-column: span 3; }
</style>