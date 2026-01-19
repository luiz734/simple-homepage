<script>
    let { onCancel, onSubmit, onDelete, widgetData, children } = $props();

    let dialog = $state();
    $effect(() => {
        dialog.showModal();
    });

    export function show() {
        dialog.showModal();
    }

    const sendForm = (event) => {
        event.preventDefault();

        const payload = {
            ...widgetData,
        };

        onSubmit(payload);
    };
</script>

<dialog bind:this={dialog} class="modal" onclose={onCancel}>
    <div class="modal-box bg-base-200 max-h-7/12 min-h-4/6 w-11/12 max-w-6xl p-8 flex flex-col overflow-hidden">
        <form
            class="flex grow flex-col justify-between gap-y-2 overflow-hidden"
            onsubmit={sendForm}
        >
            <div class="prop-content grow overflow-y-auto">
                {@render children()}
            </div>

            <div class="flex gap-x-2 shrink-0 pt-2">
                <button class="btn btn-error" onclick={onDelete} type="button">
                    Delete Widget
                </button>
                <div class="grow"></div>
                <button
                    class="btn btn-link btn-error"
                    onclick={onCancel}
                    type="button"
                >
                    Cancel
                </button>
                <button class="btn btn-primary min-w-24" type="submit" autofocus>
                    Save
                </button>
            </div>
        </form>
    </div>
</dialog>