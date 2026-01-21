<script>
    let { group = $bindable(), sections } = $props();
</script>

<div class=" btn btn-ghost btn-disabled w-full text-left">
    <span class="text-xm text-base-content/40 w-full text-left">Settings</span>
</div>

<div class="flex flex-col">
    {#each sections as section}
        <!--        <input-->
        <!--            class="join-item btn py-6"-->
        <!--            type="radio"-->
        <!--            name="settings-category"-->
        <!--            aria-label={section}-->
        <!--            value={section}-->
        <!--            bind:group-->
        <!--        />-->

        {#if section === "divider"}
            <div class="divider"></div>
        {:else}
            <label
                class="btn btn-ghost has-checked:bg-base-100 rounded-2xl py-6"
            >
                <input
                    class="peer checked:bg-accent sr-only"
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
