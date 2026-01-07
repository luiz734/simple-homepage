<script>
    import { onMount, onDestroy } from 'svelte';

    let currentTime = new Date();
    let timer;

    onMount(() => {
        timer = setInterval(() => {
            currentTime = new Date();
        }, 1000);
    });

    onDestroy(() => {
        if (timer) clearInterval(timer);
    });

    $: formattedTime = currentTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
</script>

<div class="clock-container">
    <span class="time-display">{formattedTime}</span>
</div>

<style>
    .clock-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        font-family: sans-serif;
    }

    .time-display {
        font-size: 2rem;
        font-weight: bold;
        color: #333;
    }
</style>