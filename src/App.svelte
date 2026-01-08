<script>
    import Clock from "./lib/Clock.svelte";
    import Calculator from "./lib/Calculator.svelte";
    import Shortcuts from "./lib/Shortcuts.svelte";
    import Grid from 'svelte-grid';
    import gridHelp from "svelte-grid/src/utils/helper.js";

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


</script>

<div id="app">

    <div class=demo-container>
        <Grid bind:items={items} rowHeight={100} let:item let:dataItem {cols}>
            <Shortcuts backgroundColor="{dataItem.data.color}" />
        </Grid>
    </div>


</div>

<style>
    :global(.svlt-grid-shadow) {
        /* Back shadow */
        background: pink;
    }
    :global(.svlt-grid-container) {
        /* Container color */
        background: #eee;
    }
    :global(.svlt-grid-resizer::after) {
        /* Resizer color */
        border-color: red !important;
    }
</style>