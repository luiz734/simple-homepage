<script>
    import Grid from 'svelte-grid';
    import gridHelp from "svelte-grid/src/utils/helper.js";
    import Shortcuts from "./Shortcuts.svelte";
    import {BoltIcon, Grip, GripHorizontalIcon, Plus, Settings2} from 'lucide-svelte';
    import MoveDiagonal_2 from "lucide-svelte/icons/move-diagonal-2";
    import {slide} from 'svelte/transition';
    import ShortcutsConfig from "./ShortcutsConfig.svelte";

    let {locked: editLocked, items = $bindable()} = $props();

    let selectedId = $state(null);
    let selectedWidget = $derived(
        selectedId ? items.find(i => i.id === selectedId) : null
    );
    let configOpen = $state(false);

    const cols = [
        [1100, 6],
    ];

    const onSizeChanged = (id, size) => {
        console.log(size);
        const pixelHeight = size;
        const rowHeight = 100; // Must match the Grid's rowHeight prop
        const margin = 10; // Default svelte-grid margin is usually 10px
        const newH = Math.ceil((pixelHeight + margin) / (rowHeight + margin));
        const index = items.findIndex(i => i.id === id);
        items[index][6].h = newH;
        items = [...items]; // Trigger reactivity
    }

    const toggleConfig = () => {

    };

    const onCancel = () => {
        configOpen = !configOpen;
    };

</script>


<div class=demo-container>
    <Grid bind:items={items} rowHeight={100} let:item let:dataItem {cols} let:resizePointerDown let:movePointerDown>
        <div class="sections">
            {#if !editLocked}
                <div class=dragger transition:slide onpointerdown={movePointerDown}>
                    <GripHorizontalIcon size="18px"/>
                </div>

                <div class="configButton" transition:slide={{axis: "x"}}>
                    <button type="button" class="ring-link-btn"
                            onclick={() => {
                                selectedId = dataItem.id;
                                configOpen = true;
                            }
                    }>
                        <Settings2 size={24}/>
                    </button>
                </div>
            {/if}

            <div class="widget">
                <Shortcuts backgroundColor="{dataItem.data.color}"
                           onSizeChanged={(size) => onSizeChanged(item.id, size)} {editLocked}
                           links={dataItem.data.links}
                           title={dataItem.data.title}/>
            </div>


            {#if !editLocked}
                <div class=resizer transition:slide onpointerdown={resizePointerDown}>
                    <MoveDiagonal_2 size="18px"/>
                </div>
            {/if}
        </div>

    </Grid>

    {#if configOpen && selectedWidget}
        <div class="backdrop">
            <ShortcutsConfig {onCancel} onSubmit={(newData) => {
                // items.map((i) => {console.log($state.snapshot(i))});
                const index = items.findIndex(i => i.id === selectedId);
                if (index !== -1) {
                    items[index].data = newData;
                    items = [...items];
                    console.log("updated");
                }
                // items = items;
                configOpen = false;
                selectedId = null;
            }} widgetData={selectedWidget.data}/>
        </div>
    {/if}


</div>

<style>
    :global(.svlt-grid-shadow) {
        /* Back shadow */
        background: pink;
        border-radius: 12px;
    }

    :global(.svlt-grid-container) {
        /* Container color */
        background: #0D0D0D;
    }

    :global(.svlt-grid-resizer::after) {
        /* Resizer color */
        border-color: #514D4B !important;
    }

    .sections {
        border: 1px solid #26282B;
        background-color: #151516;
        border-radius: 18px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        width: 100%;
        overflow: hidden;
        height: 100%;
        box-sizing: border-box;
        justify-content: space-between;

    }

    .demo-container {
        flex-grow: 1;
        background: #0D0D0D;
        align-items: center;
    }

    .dragger {
        border-radius: 18px 18px 0 0;
        background: #26282B;
        position: absolute;
        /*color: #2A2C2F;*/
        width: 100%;
        text-align: center;
        box-sizing: border-box;
        left: 0;
        top: 0;
        height: 24px;
    }

    .configButton {
        position: absolute;
        right: 8px;
        top: 32px;
        /*color: #358cf6 !important;*/
        white-space: nowrap; /* Prevents text wrapping during width animation */
        overflow: hidden; /* Ensures content is clipped, not wrapped */
    }

    .widget {
        /*margin: 18px 0;*/
        border: none;
        flex: 1;
        /*box-sizing: border-box;*/
    }

    .resizer {
        border-radius: 0 0 18px 18px;
        color: #9DA0A8;
        text-align: center;
        box-sizing: border-box;
        right: 4px;
        bottom: 4px;
        height: 20px;
        position: absolute;
    }

    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

</style>