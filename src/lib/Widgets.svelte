<script>
    import Grid from 'svelte-grid';
    import gridHelp from "svelte-grid/src/utils/helper.js";
    import Shortcuts from "./Shortcuts.svelte";
    import {BoltIcon, Grip, GripHorizontalIcon, Plus, Settings2} from 'lucide-svelte';
    import MoveDiagonal_2 from "lucide-svelte/icons/move-diagonal-2";
    import {slide, fade} from 'svelte/transition';
    import ShortcutsConfig from "./ShortcutsConfig.svelte";
    import Clock from "./Clock.svelte";
    import Calculator from "./Calculator.svelte";

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

    const widgetsMap = {
        "shortcuts": {component: Shortcuts, config: ShortcutsConfig},
        "clock": {component: Clock, config: null},
        "calculator": {component: Calculator, config: null},
    };

</script>

<!--<MyComponent></MyComponent>-->
<!--<button onclick={() => {MyComponent = Clock}}> click</button>-->

<div class=demo-container>
    <Grid bind:items={items} rowHeight={100} let:item let:dataItem {cols} let:resizePointerDown let:movePointerDown>
        <div class="sections" class:editing={!editLocked}>

            {#if !editLocked}
                <div class=dragger transition:slide onpointerdown={movePointerDown}>
                    <GripHorizontalIcon size="18px"/>
                </div>

<!--                Some widgets don't have configuration options-->
                {#if widgetsMap[dataItem.type]?.config}
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
            {/if}

            <div class="widget">
                {#if widgetsMap[dataItem.type]}
                    {@const WidgetComponent = widgetsMap[dataItem.type].component}

                    <WidgetComponent backgroundColor="{dataItem.data.color}"
                            {editLocked}
                            onSizeChanged={(size) => onSizeChanged(item.id, size)}
                            data={dataItem.data}/>
                {:else}
                    <p>Widget type "{dataItem.type}" not found.</p>
                {/if}
            </div>


            {#if !editLocked}
                <div class=resizer transition:slide onpointerdown={resizePointerDown}>
                    <MoveDiagonal_2 size="18px"/>
                </div>
            {/if}
        </div>

    </Grid>

    {#if configOpen && selectedWidget}
        {@const widgetDef = widgetsMap[selectedWidget.type]}

        {#if widgetDef?.config}
            {@const ConfigComponent = widgetDef.config}
            <div class="backdrop">
                <ConfigComponent
                        widgetData={selectedWidget.data}
                        {onCancel}
                        onSubmit={(newData) => {
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
                    }}
                />
            </div>
        {/if}
    {/if}


</div>
<style>
    /* 1. Grid Library Overrides */
    :global(.svlt-grid-shadow) {
        background: var(--ring-primary);
        opacity: 0.2;
        border-radius: var(--ring-radius);
    }

    :global(.svlt-grid-container) {
        background: var(--ring-content-bg);
    }

    :global(.svlt-grid-resizer::after) {
        border-color: var(--ring-text-secondary) !important;
    }

    /* 2. Main Container */
    .demo-container {
        flex-grow: 1;
        background: var(--ring-content-bg);
        align-items: center;
        /* Ensure font inherits correctly if this is a standalone container */
        font-family: var(--ring-font);
        color: var(--ring-text);
    }

    /* 3. The Widget Card (.sections) */
    .sections {
        background-color: var(--ring-dark-bg);
        border: 1px solid var(--ring-border);
        border-radius: var(--ring-radius);
        color: var(--ring-text);

        /* Layout */
        padding: 8px; /* Slightly tighter padding for Ring UI look */
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
        justify-content: space-between;

        /* Transitions */
        transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }

    /* Editing State */
    .sections.editing {
        border: 1px dashed var(--ring-text-secondary); /* Thinner, grey dashed border */
        transform: scale(0.98); /* Subtle scale */
        box-shadow: var(--ring-shadow);
        background-color: #2b3036; /* Slightly lighter to indicate "lifted" state */
    }

    /* 4. Controls */
    .dragger {
        /* Remove distinct background to match Ring UI "clean" look */
        background: transparent;
        color: var(--ring-text-secondary);

        /* Position */
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 24px;

        /* Centering the icon */
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: grab;
        z-index: 20;
    }

    .dragger:hover {
        color: var(--ring-text); /* Highlight on hover */
    }

    .configButton {
        position: absolute;
        right: 4px;
        top: 4px; /* Move into the corner */
        z-index: 21;
    }

    /* Style the actual button inside configButton to match Ring UI Icon Buttons */
    .configButton button {
        background: transparent;
        border: none;
        color: var(--ring-text-secondary);
        cursor: pointer;
        padding: 4px;
        border-radius: 2px;
        transition: color 0.2s, background-color 0.2s;
    }

    .configButton button:hover {
        color: var(--ring-primary);
        background-color: rgba(53, 140, 246, 0.1);
    }

    .widget {
        border: none;
        flex: 1;
        position: relative;
        /* Add margin top if dragger is visible to prevent overlap,
           or keep it 0 if widget handles its own spacing */
        margin-top: 12px;
    }

    .resizer {
        position: absolute;
        right: 2px;
        bottom: 2px;
        width: 16px;
        height: 16px;
        color: var(--ring-text-secondary);
        cursor: se-resize;
        z-index: 20;
        opacity: 0.5;
        transition: opacity 0.2s;
    }

    .resizer:hover {
        opacity: 1;
        color: var(--ring-primary);
    }

    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6); /* Slightly darker backdrop */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(2px); /* Optional: adds a modern touch */
    }
</style>