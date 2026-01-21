<script>
    let { group = $bindable(), sections } = $props();
</script>

<div class=" btn btn-ghost btn-disabled w-full text-left">
    <span class="text-xm text-base-content/40 w-full text-left">Settings</span>
</div>

<div class="flex flex-col">
    {#each sections as section}
        {#if section === "divider"}
            <div class="divider"></div>
        {:else}
            <label
                class={[
                    "btn btn-ghost has-checked:bg-base-100 rounded-2xl border-transparent py-6 has-checked:outline-0",
                    "not-checked:hover:bg-base-100/50 not-checked:hover:text-base-content",
                    "has-checked:hover:bg-base-100 has-checked:hover:text-base-content",
                ]}
            >
                <input
                    class="peer checked:bg-accent peer sr-only"
                    bind:group
                    value={section}
                    type="radio"
                    name="settings-category"
                    id={section}
                />
                <span class="w-full text-left font-bold">{section}</span>
            </label>
        {/if}
    {/each}
</div>
