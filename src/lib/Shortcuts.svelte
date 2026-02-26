<script>
    let { backgroundColor, onSizeChanged, editLocked, data } = $props();

    let links = $derived(data.links);
    let title = $derived(data.title);

    let shortcut_name = $state("");
    let shortcut_url = $state("");
    let container = $state();
</script>

<div
    bind:this={container}
    class="bg-base-100 text-base-content flex h-full w-full flex-col gap-y-1"
>
    <div class="mb-3 font-bold uppercase">
        {title}
    </div>

    {#each links as link}
        <div class="hover:bg-base-300 rounded-2xl">
            <a class="block w-full px-2 py-1.5" href={link.url}> {link.name}</a>
        </div>
    {/each}
</div>
