<script>
    import Grid from 'svelte-grid';
    import gridHelp from "svelte-grid/src/utils/helper.js";
    import Shortcuts from "./Shortcuts.svelte";

    const id = () => "_" + Math.random().toString(36).substr(2, 9);

    let items = [
        {
            6: gridHelp.item({
                x: 0,
                y: 0,
                w: 2,
                h: 2,
            }),
            data: { color: "#fa0"},
            id: id(),
        },

        {
            6: gridHelp.item({
                x: 3,
                y: 0,
                w: 2,
                h: 2,
            }),
            data: { color: "#faf"},
            id: id(),
        },

        {
            6: gridHelp.item({
                x: 0,
                y: 2,
                w: 2,
                h: 2,
            }),
            data: { color: "#faf"},
            id: id(),
        },
    ];

    const cols = [
        [1100, 6],
    ];

    const onSizeChanged = (id, size) => {
        console.log(size);
        const pixelHeight = size;
        const rowHeight = 100; // Must match the Grid's rowHeight prop
        const margin = 10; // Default svelte-grid margin is usually 10px

        // Calculate new grid height units (h)
        // Formula: pixels / (rowHeight + margin)
        const newH = Math.ceil((pixelHeight + margin) / (rowHeight + margin));

        const index = items.findIndex(i => i.id === id);

        // Update the item's height
        items[index][6].h = newH;
        items = [...items]; // Trigger reactivity
        // alert(size)
    }


</script>


<div class=demo-container>
    <Grid bind:items={items} rowHeight={100} let:item let:dataItem {cols}>
        <Shortcuts backgroundColor="{dataItem.data.color}" onSizeChanged={(size) => onSizeChanged(item.id, size)} />
    </Grid>
</div>

<style>
    :global(.svlt-grid-shadow) {
        /* Back shadow */
        background: pink;
        border-radius: 12px;
    }
    :global(.svlt-grid-container) {
        /* Container color */
        background: #26282B;
    }
    :global(.svlt-grid-resizer::after) {
        /* Resizer color */
        border-color: #514D4B !important;
    }

    .demo-container {
        flex-grow: 1;
        background: #26282B;
    }
</style>