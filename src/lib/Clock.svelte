<script>
    import { onMount, onDestroy } from 'svelte';

    let { data } = $props();

    let currentTime = $state(new Date());

    $effect(() => {
        const interval = setInterval(() => {
            currentTime = new Date();
        }, 1000);

        return () => clearInterval(interval);
    });

    let formattedTime = $derived(currentTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }));

    // Optional: Add a date line for a more complete widget look
    let formattedDate = $derived(currentTime.toLocaleDateString([], {
        weekday: 'short',
        month: 'long',
        day: 'numeric'
    }));
</script>

<div class="clock-container">
    <div class="time-wrapper">
        <span class="time-display">{formattedTime}</span>
        <span class="date-display">{formattedDate}</span>
    </div>
</div>

<style>
    .clock-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%; /* Fill the widget card */
        font-family: var(--ring-font);
        overflow: hidden;
    }

    .time-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
    }

    .time-display {
        font-size: 32px; /* Large and clear */
        font-weight: 700; /* Bold for readability */
        color: var(--ring-text);
        line-height: 1.1;

        /* Crucial for clocks: prevents jitter when numbers change width */
        font-variant-numeric: tabular-nums;
        letter-spacing: 1px;
    }

    .date-display {
        font-size: 12px;
        color: var(--ring-text-secondary);
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 0.5px;
    }
</style>