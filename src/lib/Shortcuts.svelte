<script>
    import {slide} from 'svelte/transition';
    import {onMount} from 'svelte';
    import {Grip, GripHorizontalIcon, PencilIcon} from "lucide-svelte";
    import MoveDiagonal_2 from "lucide-svelte/icons/move-diagonal-2";

    let {backgroundColor, onSizeChanged, editLocked} = $props();


    let links = $state([
        {"url": "http://google.com", "name": "Google"},
        {"url": "http://google.com", "name": "Youtube"},
    ]);

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
        Category
    </div>

    {#each links as link}
        <div class="shortcuts-block">
            <a class="prevent-select" href="{link.url}"> {link.name}</a>
        </div>
    {/each}


    {#if inputsVisible}
        <div transition:slide>
            <div class="inputs">
                <div>
                    <label for="shortcutName"> Name </label>
                    <input id="shortcutName" type="text" bind:value={shortcut_name}/>
                </div>
                <div>
                    <label for="shortcutURL"> Url </label>
                    <input id="shortcutURL" type="text" bind:value={shortcut_url}/>
                </div>
            </div>

            <button class="confirm prevent-select" onclick={addLink} type="button">Add</button>
        </div>
    {/if}

    {#if !editLocked}
        <div class="edit-button">
            <PencilIcon size="16px"/>
            <button class="prevent-select"
                    onclick={toggleInputsVisible}> Edit... </button>
        </div>

    {/if}


</div>

<style>
    .shortcuts {
        display: flex;
        flex-direction: column;


        /*color: var(--bg);*/
        width: 100%;
        /*height: auto;*/
        /*min-height: 100%;*/
        /*box-sizing: border-box;*/
        padding: 4px;
    }

    .shortcuts-block {
        /*border: 1px solid #ddd;*/
        margin: 8px 0;
    }

    input {
        width: 100%;
        box-sizing: border-box;
    }

    .title {
        font-weight: bold;
        font-size: 24px;
        margin: 10px 0 20px;
        text-align: left;
    }

    .inputs {
        margin-top: 18px;
    }

    .inputs > div {
        margin: 10px 0;
    }

    .edit-button {
        display: flex;
        /*align-items: center;*/
        justify-content: center;
        flex-direction: row;
        margin: 20px 0 0px;
        color: #366ACF;
    }
    button:hover {
        background: #2A2C2F;
    }

    button {
        border: none;
        color: #366ACF;
        cursor: pointer;
        background-color: inherit;
        font-size: 16px;
        display: inline-block;
    }




    .confirm {
        background-color: darkolivegreen;
        color: white;
        font-size: 1em;
        padding: 10px;
    }


</style>