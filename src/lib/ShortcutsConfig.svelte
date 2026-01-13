<script>
    import {Pencil, Check, Plus} from 'lucide-svelte'; // Added Plus icon
    import {tick} from 'svelte';
    import {slide} from 'svelte/transition';

    let {onCancel, onSubmit, widgetData} = $props();
    let links = $derived(widgetData.links);

    let title = "Edit Shortcuts";
    let isEditingTitle = false;
    let titleInput;

    async function enableTitleEdit() {
        isEditingTitle = true;
        await tick();
        titleInput?.focus();
    }

    function saveTitle(event) {
        event.preventDefault();
        isEditingTitle = false;
    }

    function handleTitleKeydown(e) {
        if (e.key === 'Enter') saveTitle();
    }

    function removeRow(index) {
        console.log("before", $state.snapshot(widgetData));
        links = links.filter((_, i) => i !== index);
        console.log("after", $state.snapshot(widgetData));
    }

    // New function to add a row
    function addRow() {
        const last = links[links.length - 1];
        if (last.name === "" || last.url === "") {
            return;
        }
        links = [...links, {name: "", url: ""}];
    }

    const sendForm = (event) => {
        event.preventDefault();

        const payload = {
            ...widgetData,
            links: links
        };

        onSubmit(payload);
    }

</script>

<div class="ring-dialog">
    <form onsubmit={sendForm} class="form-container">

        <div class="title-row">
            {#if isEditingTitle}
                <input
                        bind:this={titleInput}
                        bind:value={title}
                        class="title-input"
                        onkeydown={handleTitleKeydown}
                        onblur={saveTitle}
                />
                <button type="button" class="ring-btn-icon title-icon" onmousedown={saveTitle}>
                    <Check size={18}/>
                </button>
            {:else}
                <h1 class="dialog-title" onclick={enableTitleEdit}>{title}</h1>
                <button type="button" class="ring-btn-icon title-icon" onclick={enableTitleEdit}>
                    <Pencil size={18}/>
                </button>
            {/if}
        </div>

        <div class="grid-row mb-2 prevent-select">
            <div class="header">Name</div>
            <div class="header">URL</div>
            <div class="header"></div>
        </div>

        <div class="dataOverflow">
            {#each links as row, i (row)}
                <div class="grid-row mb-2" transition:slide|local>
                    <input type="text" class="ring-input" bind:value={row.name} placeholder="Name"/>
                    <input type="url" class="ring-input" bind:value={row.url} placeholder="https://example.com"/>
                    <button type="button" class="ring-btn ring-btn-icon" onclick={() => removeRow(i)} title="Remove">
                        <span class="prevent-select"> ✕ </span>
                    </button>
                </div>
            {/each}
        </div>

        <button type="button" class="ring-link-btn prevent-select" onclick={addRow}>
            <Plus size={16}/>
            Add Shortcut
        </button>

        <div class="footer-buttons prevent-select">
            <button type="submit" class="ring-btn ring-btn-primary" >Save</button>
            <button type="button" class="ring-btn" onclick={onCancel}>Cancel</button>
        </div>
    </form>
</div>

<style>
    :global(body) {
        background-color: #191919;
        color: #dfdfdf;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .ring-dialog {
        --ring-dark-bg: #23272b;
        --ring-border: #474747;
        --ring-input-bg: #191919;
        --ring-text: #dfdfdf;
        --ring-text-secondary: #808080;
        --ring-primary: #358cf6;
        --ring-primary-hover: #307ecc;
        --ring-error: #c22731;

        background-color: var(--ring-dark-bg);
        color: var(--ring-text);
        padding: 24px;
        border-radius: 4px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);

        width: 600px;
        margin: 20px auto;
    }

    .dataOverflow {
        max-height: 300px; /* Adjust this value to your preferred max height */
        overflow-y: auto; /* Enables vertical scrolling */
        overflow-x: hidden; /* Hides horizontal scrollbar */
        padding-right: 4px; /* Adds space for the scrollbar to avoid overlap */
        margin-bottom: 16px; /* Spacing between the list and the 'Add' button */
    }

    /* Optional: Style the scrollbar to match the dark theme */
    .dataOverflow::-webkit-scrollbar {
        width: 8px;
    }

    .dataOverflow::-webkit-scrollbar-track {
        background: #23272b;
    }

    .dataOverflow::-webkit-scrollbar-thumb {
        background-color: #474747;
        border-radius: 4px;
    }

    .dataOverflow::-webkit-scrollbar-thumb:hover {
        background-color: #555;
    }

    /* Title Styles */
    .title-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        height: 32px;
    }

    .dialog-title {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        cursor: text;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .title-input {
        background-color: var(--ring-input-bg);
        border: 1px solid var(--ring-primary);
        color: var(--ring-text);
        font-size: 18px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 2px;
        width: 100%;
        margin: 0;
        outline: none;
        font-family: inherit;
    }

    .title-icon {
        color: var(--ring-text-secondary);
        opacity: 0.7;
    }

    .title-icon:hover {
        opacity: 1;
        color: var(--ring-primary);
        background-color: transparent;
    }

    /* Grid Styles */
    .grid-row {
        display: grid;
        grid-template-columns: 1fr 2fr 32px;
        gap: 8px;
        align-items: center;
    }

    .mb-2 {
        margin-bottom: 8px;
    }


    .ring-btn-icon {
        height: 32px;
    }

    .header {
        font-size: 12px;
        color: var(--ring-text-secondary);
        text-transform: uppercase;
        font-weight: 600;
        padding-bottom: 4px;
    }

    .ring-input {
        background-color: var(--ring-input-bg);
        border: 1px solid var(--ring-border);
        color: var(--ring-text);
        padding: 6px 10px;
        border-radius: 2px;
        font-size: 14px;
        line-height: 20px;
        width: 100%;
        box-sizing: border-box;
        transition: border-color 0.15s ease-in-out;
    }

    .ring-input:focus {
        outline: none;
        border-color: var(--ring-primary);
    }

    /* Add Row Button Style */
    .ring-link-btn {
        background: none;
        border: none;
        color: var(--ring-primary);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        padding: 0;
        margin-bottom: 24px;
    }

    .ring-link-btn:hover {
        color: var(--ring-primary-hover);
        text-decoration: underline;
    }

    /* Footer Buttons */
    .footer-buttons {
        display: flex;
        gap: 12px;
    }

    .ring-btn {
        background-color: transparent;
        border: 1px solid var(--ring-border);
        color: var(--ring-text);
        padding: 0 16px;
        height: 32px;
        line-height: 30px;
        font-size: 14px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .ring-btn:hover {
        border-color: #707070;
    }

    .ring-btn-primary {
        background-color: var(--ring-primary);
        border-color: var(--ring-primary);
        color: #fff;
        font-weight: 500;
    }

    .ring-btn-primary:hover {
        background-color: var(--ring-primary-hover);
        border-color: var(--ring-primary-hover);
    }

    .ring-btn-icon {
        padding: 0;
        width: 28px;
        height: 28px;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--ring-text-secondary);
        background: transparent;
        cursor: pointer;
    }

    .grid-container .ring-btn-icon:hover {
        color: var(--ring-error);
        background-color: rgba(194, 39, 49, 0.1);
    }
</style>