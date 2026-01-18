<script>
    import Grid from "svelte-grid";
    import Shortcuts from "./Shortcuts.svelte";
    import { GripHorizontalIcon, Settings2 } from "lucide-svelte";
    import MoveDiagonal_2 from "lucide-svelte/icons/move-diagonal-2";
    import { slide } from "svelte/transition";
    import ShortcutsConfig from "./widget_config/ShortcutsConfig.svelte";
    import Clock from "./Clock.svelte";
    import Calculator from "./Calculator.svelte";
    import EmptyConfig from "./widget_config/EmptyConfig.svelte";
    import WidgetTypeSelector from "./WidgetTypeSelector.svelte";
    import { getContext } from "svelte";
    import { APPLICATION_KEY } from "./storage/database.svelte.js";

    const context = getContext(APPLICATION_KEY);
    let { locked: editLocked, items = $bindable(), restoreWidgets } = $props();

    let selectedId = $state(null);
    let selectedWidget = $derived(
        selectedId ? items.find((i) => i.id === selectedId) : null,
    );
    let configOpen = $state(false);
    let selector = $state();

    const cols = [[1100, 6]];

    const onSizeChanged = (id, size) => {
        console.log(size);
        const pixelHeight = size;
        const rowHeight = 100; // Must match the Grid's rowHeight prop
        const margin = 10; // Default svelte-grid margin is usually 10px
        const newH = Math.ceil((pixelHeight + margin) / (rowHeight + margin));
        const index = items.findIndex((i) => i.id === id);
        items[index][6].h = newH;
        items = [...items]; // Trigger reactivity
    };

    const toggleConfig = () => {};

    const onCancel = () => {
        configOpen = !configOpen;
    };

    const addWidget = () => {
        selector.show();
    };

    const widgetsMap = {
        shortcuts: { component: Shortcuts, config: ShortcutsConfig },
        clock: { component: Clock, config: EmptyConfig },
        calculator: { component: Calculator, config: EmptyConfig },
    };

    /* Svelte 5 Compatible Action */
    const shrinkEffect = (node, enabled) => {
        let resizeObserver;

        function updateScale() {
            // If editing is locked (enabled is false), clear transform
            if (!enabled) {
                node.style.transform = "";
                return;
            }

            const { offsetWidth: width, offsetHeight: height } = node;
            const shrinkTotal = 20; // 10px per side * 2

            // Safety check to prevent negative scale
            if (width <= shrinkTotal || height <= shrinkTotal) return;

            const scaleX = (width - shrinkTotal) / width;
            const scaleY = (height - shrinkTotal) / height;

            node.style.transform = `scale(${scaleX}, ${scaleY})`;
        }

        // Initialize Observer
        resizeObserver = new ResizeObserver(updateScale);

        // Initial trigger
        updateScale();
        if (enabled) resizeObserver.observe(node);

        return {
            // This runs whenever the parameter (!editLocked) changes
            update(newEnabled) {
                enabled = newEnabled;
                if (enabled) {
                    resizeObserver.observe(node);
                    updateScale();
                } else {
                    resizeObserver.disconnect();
                    node.style.transform = "";
                }
            },
            // This runs when the component/element is destroyed
            destroy() {
                resizeObserver.disconnect();
            },
        };
    };
</script>

<!--<MyComponent></MyComponent>-->
<!--<button onclick={() => {MyComponent = Clock}}> click</button>-->

<div class="demo-container">
    <Grid
        bind:items
        {cols}
        gap={[4, 4]}
        let:dataItem
        let:item
        let:movePointerDown
        let:resizePointerDown
        rowHeight={100}
    >
        <div
            class="sections"
            class:editing={!editLocked}
            use:shrinkEffect={!editLocked}
        >
            {#if !editLocked}
                <div
                    class="dragger"
                    transition:slide
                    onpointerdown={movePointerDown}
                >
                    <GripHorizontalIcon size="18px" />
                </div>

                <!--{#if widgetsMap[dataItem.type]?.config}-->
                <div class="configButton" transition:slide={{ axis: "x" }}>
                    <button
                        type="button"
                        class="ring-link-btn"
                        onclick={() => {
                            selectedId = dataItem.id;
                            configOpen = true;
                        }}
                    >
                        <Settings2 size={18} />
                    </button>
                </div>
                <!--{/if}-->
            {/if}

            <div class="widget">
                {#if widgetsMap[dataItem.type]}
                    {@const WidgetComponent =
                        widgetsMap[dataItem.type].component}

                    <WidgetComponent
                        backgroundColor={dataItem.data.color}
                        {editLocked}
                        onSizeChanged={(size) => onSizeChanged(item.id, size)}
                        data={dataItem.data}
                    />
                {:else}
                    <p>Widget type "{dataItem.type}" not found.</p>
                {/if}
            </div>

            {#if !editLocked}
                <div
                    class="resizer"
                    transition:slide
                    onpointerdown={resizePointerDown}
                >
                    <MoveDiagonal_2 size="18px" />
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
                        const index = items.findIndex(
                            (i) => i.id === selectedId,
                        );
                        if (index !== -1) {
                            items[index].data = newData;
                            items = [...items];
                            // console.log("updated", $state.snapshot(items));
                        }
                        configOpen = false;
                        selectedId = null;
                    }}
                    onDelete={() => {
                        const index = items.findIndex(
                            (i) => i.id === selectedId,
                        );
                        if (index !== -1) {
                            items.splice(index, 1);
                        }
                        configOpen = false;
                        selectedId = null;
                    }}
                />
            </div>
        {/if}
    {/if}

    {#if !editLocked}
        <div
            class="bg-base-200 fixed bottom-2 left-1/2 z-20 flex h-14 -translate-x-1/2 items-center justify-center gap-4 rounded-md p-3"
            transition:slide
        >
            <button onclick={addWidget} class="btn btn-success">
                Add Widget</button
            >
            <button onclick={restoreWidgets} class="btn btn-error">
                Discard All Changes</button
            >
        </div>
    {/if}

    <WidgetTypeSelector
        bind:this={selector}
        onWidgetSelected={(widgetString) => {
            context.addWidget(widgetString);
        }}
    ></WidgetTypeSelector>
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

    .demo-container {
        flex-grow: 1;
        background: var(--ring-content-bg);
        align-items: center;
        /* Ensure font inherits correctly if this is a standalone container */
        font-family: var(--ring-font);
        color: var(--ring-text);
        padding: 4px;
    }

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
        transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
    }

    /* Editing State */
    .sections.editing {
        border: 1px dashed var(--ring-text-secondary); /* Thinner, grey dashed border */
        /*transform: scale(0.98); !* Subtle scale *!*/
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
        transition:
            color 0.2s,
            background-color 0.2s;
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
