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

    // console.log($state.snapshot(items));

    let selectedId = $state(null);
    let selectedWidget = $derived(
        selectedId ? items.find((i) => i.id === selectedId) : null,
    );
    let configOpen = $state(false);
    let selector = $state();
    let widgetConfigDialog = $state();

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

<div class="demo-container bg-base-300 text-primary-content min-h-full p-2">
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
            class={[
                "card bg-base-100 h-full w-full overflow-auto border-2  p-8 transition-all duration-200 ease-out",
                !editLocked && "border-accent border-dashed shadow-sm",
                editLocked && "border-base-300",
            ]}
            use:shrinkEffect={!editLocked}
        >
            {#if !editLocked}
                {@render widget_buttons(
                    movePointerDown,
                    () => {
                        selectedId = dataItem.id;
                        configOpen = true;
                    },
                    resizePointerDown,
                )}
            {/if}

            {#if widgetsMap[dataItem.type]}
                {@const WidgetComponent = widgetsMap[dataItem.type].component}

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
    </Grid>

    {#if !editLocked}
        {@render floating_buttons(addWidget, restoreWidgets)}
    {/if}

    <WidgetTypeSelector
        bind:this={selector}
        onWidgetSelected={(widgetString) => {
            context.addWidget(widgetString);
        }}
    ></WidgetTypeSelector>
</div>

{#if selectedWidget}
    {@render config_popup()}
{/if}

{#snippet widget_buttons(movePointerDown, onClickConfig, resizePointerDown)}
    <button
        class="dragger text-base-content btn btn-link absolute top-0 left-1/2 z-20 flex w-full -translate-x-1/2 cursor-grab items-center justify-center focus:outline-0"
        onpointerdown={movePointerDown}
        transition:slide
    >
        <GripHorizontalIcon size="18px" />
    </button>

    <div class="absolute top-0 right-0 z-20" transition:slide={{ axis: "x" }}>
        <button
            type="button"
            class="btn btn-link text-base-content focus:outline-0"
            onclick={onClickConfig}
        >
            <Settings2 size="18px" />
        </button>
    </div>

    <div
        class="resizer btn btn-link text-base-content absolute right-0 bottom-0 cursor-se-resize items-center justify-center focus:outline-0"
        transition:slide={{ axis: "x" }}
        onpointerdown={resizePointerDown}
    >
        <MoveDiagonal_2 size="18px" />
    </div>
{/snippet}

{#snippet floating_buttons(addWidget, restoreWidgets)}
    <div
        class="bg-base-100 border-base-content/10 fixed bottom-2 left-1/2 z-20 flex h-20 -translate-x-1/2 items-center justify-center gap-4 rounded-md border p-6"
        transition:slide
    >
        <button class="btn btn-success" onclick={addWidget}> Add Widget</button>
        <button class="btn btn-error" onclick={restoreWidgets}>
            Discard All Changes</button
        >
    </div>
{/snippet}

{#snippet config_popup()}
    {@const widgetDef = widgetsMap[selectedWidget.type]}

    {#if widgetDef?.config}
        {@const ConfigComponent = widgetDef.config}
        <ConfigComponent
            bind:this={widgetConfigDialog}
            widgetData={selectedWidget.data}
            onCancel={() => {
                configOpen = false;
                selectedId = null;
            }}
            onSubmit={(newData) => {
                const index = items.findIndex((i) => i.id === selectedId);
                if (index !== -1) {
                    items[index].data = newData;
                    items = [...items];
                }
                configOpen = false;
                selectedId = null;
            }}
            onDelete={() => {
                const index = items.findIndex((i) => i.id === selectedId);
                if (index !== -1) {
                    items.splice(index, 1);
                }
                configOpen = false;
                selectedId = null;
            }}
        />
    {/if}
{/snippet}
