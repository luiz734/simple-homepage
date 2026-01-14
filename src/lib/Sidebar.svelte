<script>
    import {Lock, Unlock, User} from "lucide-svelte";

    let {locked, onToggle} = $props();



</script>

<div class="sidebar">
    <button onclick={onToggle}>
        {#if locked}
            <Lock/>
        {:else}
            <Unlock/>
        {/if}
    </button>

    <button>
        <User/>
    </button>
</div>

<style>
    .sidebar {
        margin: 0;
        width: 48px;
        background-color: #0D0D0D;
        color: #FEFEFE;
        /*position: fixed;*/
        /*height: 100%;*/
        overflow: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    /* Sidebar links */
    .sidebar button {
        width: 100%;
        height: 48px;
        background-color: #26282B;
        border: none;
        color: #FEFEFE;
        border-radius: 4px;
    }

    /* Active/current link */
    .sidebar button:hover {
        background-color: #393B40;
    }
</style>