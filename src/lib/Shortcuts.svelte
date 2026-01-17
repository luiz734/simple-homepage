<script>
    import {slide} from 'svelte/transition';
    import {onMount} from 'svelte';
    import {Grip, GripHorizontalIcon, PencilIcon} from "lucide-svelte";
    import MoveDiagonal_2 from "lucide-svelte/icons/move-diagonal-2";
    import ShortcutsConfig from "./widget_config/ShortcutsConfig.svelte";

    let {backgroundColor, onSizeChanged, editLocked, data} = $props();

    let links = $derived(data.links);
    let title = $derived(data.title);

    let shortcut_name = $state("");
    let shortcut_url = $state("");

    let inputsVisible = $state(false);
    let container = $state();

    // onMount(() => {
    //     onSizeChanged(container.clientHeight);
    // });

    const addLink = () => {
        // if (shortcut_name === "" || shortcut_name === "") {
        //     return;
        // }
        links.push({"url": shortcut_url, "name": shortcut_name});
        shortcut_name = shortcut_url = "";
        onSizeChanged(container.clientHeight);
    };

    const toggleInputsVisible = () => {
        inputsVisible = !inputsVisible;
    };


</script>


<div class="shortcuts" bind:this={container} style:--bg="{backgroundColor}">

    <div class="title">
        {title}
    </div>

    {#each links as link}
        <div class="shortcuts-block">
            <a class="prevent-select" href="{link.url}"> {link.name}</a>
        </div>
    {/each}


    {#if inputsVisible}
        <div transition:slide>
            <ShortcutsConfig onClose={()=>{}}/>
        </div>
    {/if}



</div>
<style>
    .shortcuts {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%; /* Ensure it fills the card */
        box-sizing: border-box;
        padding: 0 8px; /* Match parent padding logic */
        overflow-y: auto; /* Allow scrolling if list is long */
    }

    /* Scrollbar styling for Ring UI look */
    .shortcuts::-webkit-scrollbar {
        width: 8px;
    }
    .shortcuts::-webkit-scrollbar-track {
        background: transparent;
    }
    .shortcuts::-webkit-scrollbar-thumb {
        background-color: var(--ring-border);
        border-radius: 4px;
    }

    .title {
        font-size: 14px; /* Ring UI headers are usually smaller and tighter */
        font-weight: 700;
        color: var(--ring-text);
        margin: 8px 0 12px 0;
        text-transform: uppercase; /* Optional: distinctive header style */
        letter-spacing: 0.5px;
    }

    /* If you have a list of links, they likely go here */
    .shortcuts-block {
        margin: 4px 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    /* Standard Input Styling */
    input {
        width: 100%;
        box-sizing: border-box;
        background-color: var(--ring-input-bg, #191919);
        border: 1px solid var(--ring-border);
        color: var(--ring-text);
        padding: 6px 8px;
        border-radius: 2px;
        font-size: 13px;
        outline: none;
        transition: border-color 0.2s;
    }

    input:focus {
        border-color: var(--ring-primary);
    }

    .inputs {
        margin-top: 16px;
    }

    .inputs > div {
        margin: 8px 0;
    }

    /* Button Styling */
    .edit-button {
        display: flex;
        justify-content: flex-start; /* Ring UI usually aligns left */
        flex-direction: row;
        margin-top: auto; /* Push to bottom if flex container */
        padding-top: 12px;
    }

    button {
        border: none;
        background-color: transparent;
        color: var(--ring-primary); /* #358cf6 */
        cursor: pointer;
        font-size: 13px; /* Standard Ring UI size */
        padding: 4px 8px;
        border-radius: 2px;
        transition: color 0.2s, background-color 0.2s;
        text-align: left;
    }

    button:hover {
        color: var(--ring-primary-hover);
        background-color: rgba(53, 140, 246, 0.1); /* Subtle blue tint on hover */
        text-decoration: none;
    }

    /* Primary/Confirm Button Variant */
    .confirm {
        background-color: var(--ring-primary);
        color: white;
        font-weight: 500;
        padding: 6px 16px;
        border-radius: 4px; /* Ring UI buttons are usually 4px radius */
    }

    .confirm:hover {
        background-color: var(--ring-primary-hover);
        color: white; /* Ensure text stays white */
    }
</style>