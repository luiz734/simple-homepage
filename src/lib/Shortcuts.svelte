<script>
    import {slide} from 'svelte/transition';
    import { onMount } from 'svelte';

    let {backgroundColor, onSizeChanged} = $props();


    let links = $state([
        {"url": "http://google.com", "name": "Google"},
        {"url": "http://google.com", "name": "Youtube"},
    ]);

    let shortcut_name = $state("");
    let shortcut_url = $state("");

    let inputsVisible = $state(false);
    let container = $state();

    onMount(() => {
        onSizeChanged(container.clientHeight);
    });

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

            <button class="confirm" onclick={addLink} type="button">Add</button>
        </div>


    {/if}

    <button id="showHide" onclick={toggleInputsVisible}> {inputsVisible ? "hide" : "show"} </button>

</div>

<style>
    .shortcuts {
        display: flex;
        flex-direction: column;
        /*border: 1px solid #ddd;*/
        border-radius: 12px;
        padding: 12px;
        background-color: #191A1C;
        color: var(--bg);
        height: auto;
        min-height: 100%;
        box-sizing: border-box;
        }

    .shortcuts-block {
        /*border: 1px solid #ddd;*/
        padding: 10px;
    }

    input {
        width: 100%;
        box-sizing: border-box;
    }

    .inputs {
        margin-top: 18px;
    }

    .inputs > div {
        margin: 10px 0;
    }

    button {
        width: 100%;
    }
    #showHide {
        margin-top: 16px;
    }
    .confirm {
        background-color: darkolivegreen;
        color: white;
        font-size: 1em;
        padding: 10px;
    }
</style>