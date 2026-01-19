<script>
    import { Pencil, Check, Plus, Trash } from "lucide-svelte"; // Added Plus icon
    import { tick } from "svelte";
    import { slide } from "svelte/transition";
    import WidgetConfig from "../templates/WidgetConfig.svelte";

    let { onCancel, onSubmit, onDelete, widgetData } = $props();

    // We want copies
    // Values will be changed in the submit callback
    let links = $state(structuredClone($state.snapshot(widgetData.links)));
    let title = $state(widgetData.title);
    let isEditingTitle = $state(false);
    let titleInput;

    async function enableTitleEdit() {
        isEditingTitle = true;
        await tick();
        titleInput?.focus();
    }

    function saveTitle() {
        isEditingTitle = false;
        document.activeElement.blur();
    }

    function handleTitleKeydown(e) {
        if (e.key === "Enter") {
            saveTitle();
        }
    }

    function removeRow(index) {
        links = links.filter((_, i) => i !== index);
    }

    function addRow() {
        const last = links[links.length - 1];
        if (last.name === "" || last.url === "") {
            return;
        }
        links = [...links, { name: "", url: "" }];
        scrollToBottom();
    }

    let bottomRef;
    $effect(() => {
        scrollToBottom();
    });
    const scrollToBottom = () => {
        tick().then(() => {
            bottomRef?.scrollIntoView({ behavior: "smooth", block: "end" });
        });
    }

    const sendForm = (event) => {
        event.preventDefault();

        const payload = {
            ...widgetData,
            title: title,
            links: links,
        };

        onSubmit(payload);
    };
</script>

<WidgetConfig
    {onCancel}
    {onDelete}
    {onSubmit}
    widgetData={{
        ...widgetData,
        title,
        links,
    }}
>
    <div class="text-base-content flex justify-start pb-4">
        {#if isEditingTitle}
            <input
                bind:this={titleInput}
                bind:value={title}
                class="w-full text-xl font-bold"
                onkeydown={handleTitleKeydown}
                onblur={saveTitle}
            />
            <button type="button" class="btn btn-ghost" onmousedown={saveTitle}>
                <Check size="18px" />
            </button>
        {:else}
            <button
                class="btn btn-link text-base-content w-full justify-start px-0 text-xl font-bold no-underline"
                onclick={enableTitleEdit}
            >
                {title}
                <span class="text-base-content/50">
                    <Pencil size={18} />
                </span>
            </button>
        {/if}
    </div>

    <div class="grid grid-cols-[1fr_2fr_auto] gap-x-4">
        <div class="text-primary-content font-extrabold">Name</div>
        <div class="text-primary-content font-extrabold">URL</div>
        <div class="w-16"></div>
    </div>

    <div class="mt-4 flex flex-col">
        {#each links as row, i (row)}
            <div class="grid grid-cols-[1fr_2fr_auto] gap-x-4 items-center box" transition:slide|local>

                <label class="label mt-2">
                    <input
                        type="text"
                        class="input input-md"
                        bind:value={row.name}
                        placeholder="My Shortcut"
                    />
                </label>

                <label class="label">
                    <input
                            type="url"
                            class="input input-md w-full"
                            bind:value={row.url}
                            placeholder="https://www.example.com"
                    />
                </label>

                <button
                    type="button"
                    class="btn btn-error btn-link w-16"
                    onclick={() => removeRow(i)}
                    title="Remove"
                >
                    Delete
                </button>

            </div>
        {/each}
    </div>

    <button bind:this={bottomRef} class="btn btn-primary btn-link mt-4" onclick={addRow} type="button">
        <Plus size={16} />
        Add Shortcut
    </button>


</WidgetConfig>
