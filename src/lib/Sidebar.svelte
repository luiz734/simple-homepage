<script>
    import {Lock, Unlock, User} from "lucide-svelte";

    let {locked, onToggle} = $props();
</script>

<div class="sidebar">
    <button onclick={onToggle} class:active={!locked} title={locked ? "Unlock Layout" : "Lock Layout"}>
        {#if locked}
            <Lock size={20} />
        {:else}
            <Unlock size={20} />
        {/if}
    </button>

    <button title="User Profile">
        <User size={20} />
    </button>
</div>

<style>
    .sidebar {
        /* Layout */
        width: 60px; /* Standard toolbar width */
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px 0; /* Vertical padding */
        gap: 8px; /* Space between icons */
        box-sizing: border-box;

        /* Theme Colors */
        background-color: var(--ring-dark-bg);
        border-right: 1px solid var(--ring-border);
    }

    /* Base Button Style (Toolbar Icon) */
    .sidebar button {
        width: 40px;
        height: 40px;
        background-color: transparent; /* Cleaner default look */
        border: none;
        color: var(--ring-text-secondary); /* #808080 */
        border-radius: var(--ring-radius); /* 4px */
        cursor: pointer;

        display: flex;
        align-items: center;
        justify-content: center;

        transition: all 0.2s ease;
    }

    /* Hover State */
    .sidebar button:hover {
        background-color: rgba(255, 255, 255, 0.05);
        color: var(--ring-text); /* Brighter white on hover */
    }

    /* Active State (Used for the Unlock button when editing) */
    .sidebar button.active {
        color: var(--ring-primary); /* Blue */
        background-color: rgba(53, 140, 246, 0.1); /* Blue Tint */
    }

    /* Optional: Active state hover */
    .sidebar button.active:hover {
        background-color: rgba(53, 140, 246, 0.2);
    }
</style>