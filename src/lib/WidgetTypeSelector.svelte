<script>
    let { onWidgetSelected } = $props();

    const widgets = ["clock", "shortcuts", "calculator"];
    let dialog = $state();

    export function show() {
        dialog.showModal();
    }

    // Internal sorting only (does not affect props)

</script>

<dialog bind:this={dialog} class="modal">
    <div
        class="modal-box bg-base-200 flex min-h-4/6 w-11/12 max-w-2xl flex-col gap-y-8"
    >
        <button
            class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2"
            onclick={() => {
                dialog.close();
            }}>✕</button
        >
        <h1 class="w-full text-center font-bold">Add Widget</h1>
        <form class="flex h-full grow gap-2">
            {#each widgets as widget}
                <button
                    class="btn btn-soft hover:bg-primary h-32 w-32 items-center justify-center overflow-clip shadow-sm"
                    onclick={(event) => {
                        event.preventDefault();
                        onWidgetSelected(widget);
                    }}
                >
                    {widget}
                </button>
            {/each}
        </form>
    </div>

    <form class="modal-backdrop" method="dialog">
        <button>close</button>
    </form>
</dialog>

<style>
</style>
