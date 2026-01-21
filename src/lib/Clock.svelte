<script>
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

    let formattedDate = $derived(currentTime.toLocaleDateString([], {
        weekday: 'short',
        month: 'long',
        day: 'numeric'
    }));
</script>

<div class="flex flex-col items-center justify-center w-full h-full select-none">

    <span class="text-4xl font-bold tracking-wide tabular-nums text-base-content">
        {formattedTime}
    </span>

    <span class="text-xs font-semibold uppercase tracking-wider text-base-content/60 mt-1">
        {formattedDate}
    </span>

</div>