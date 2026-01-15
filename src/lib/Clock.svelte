<script>
    import {onMount, onDestroy} from 'svelte';

    let {data} = $props();

    let currentTime = $state(new Date());
    $effect(() => {
        const interval = setInterval(() => {
            currentTime = new Date();
        }, 1000);

        return () => clearInterval(interval);
    })

    let formattedTime = $derived(currentTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }));

</script>

<div class="clock-container">
    <span class="time-display">{formattedTime}</span>
</div>

<style>
    .clock-container {
        display: flex;
        justify-content: center;
        align-items: center;
        /*padding: 1rem;*/
        font-family: sans-serif;
    }

    .time-display {
        font-size: 2rem;
        font-weight: bold;
        color: #999;
    }
</style>