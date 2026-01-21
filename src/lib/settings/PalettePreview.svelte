<script>
    // Receive 'name' to group radios, and 'bind:group' if state tracking is needed
    let { theme, name, group = $bindable() } = $props();
</script>

<label class="cursor-pointer relative block w-40">
    <input
        aria-label={theme}
        bind:group={group}
        class="peer sr-only"
        {name}
        type="radio"
        value={theme}
    />

    <div
        class="border-base-content/20 hover:border-base-content/40 overflow-hidden rounded-lg border outline-3 outline-offset-2 outline-transparent peer-checked:outline-base-content"
    >
        <div
            class="bg-base-100 text-base-content w-full font-sans"
            data-theme={theme}
        >
            <div class="grid grid-cols-5 grid-rows-3">
                <div class="bg-base-200 col-start-1 row-span-2 row-start-1"></div>
                <div class="bg-base-300 col-start-1 row-start-3"></div>
                <div
                    class="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2"
                >
                    <div class="mx-auto w-fit">
                        <div class="font-bold">{theme}</div>
                        <div class="flex flex-wrap gap-1 justify-center">
                            <div class="shrink-0 flex items-center justify-center bg-primary text-primary-content font-bold aspect-square w-5 rounded lg:w-6">A</div>
                            <div class="shrink-0 flex items-center justify-center bg-secondary text-secondary-content font-bold aspect-square w-5 rounded lg:w-6">A</div>
                            <div class="shrink-0 flex items-center justify-center bg-accent text-accent-content font-bold aspect-square w-5 rounded lg:w-6">A</div>
                            <div class="shrink-0 flex items-center justify-center bg-neutral text-neutral-content font-bold aspect-square w-5 rounded lg:w-6">A</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</label>