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


<div class="bg-base-100 w-full h-full flex flex-col text-base-content gap-y-1" bind:this={container}>

    <div class="font-bold mb-3 uppercase">
        {title}
    </div>

    {#each links as link}
        <div class="p-1">
            <a target="_blank" class="hover:bg-base-300 rounded-2xl p-2" href="{link.url}"> {link.name}</a>
        </div>
    {/each}
</div>