<script>
    let { data } = $props();

    let currentTime = $state(new Date());

    $effect(() => {
        const interval = setInterval(() => {
            currentTime = new Date();
        }, 1000);

        return () => clearInterval(interval);
    });

    let formattedTime = $derived(
        currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }),
    );

    let formattedDate = $derived(
        currentTime.toLocaleDateString([], {
            weekday: "short",
            month: "long",
            day: "numeric",
        }),
    );
</script>

<div
    class="flex h-full w-full flex-col items-center justify-center select-none"
>
    <span
        class="text-base-content text-4xl font-bold tracking-wide tabular-nums"
    >
        {formattedTime}
    </span>

    <span
        class="text-base-content/60 mt-1 text-xs font-semibold tracking-wider uppercase"
    >
        {formattedDate}
    </span>
</div>
