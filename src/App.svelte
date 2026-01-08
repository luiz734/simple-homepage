<script>
    import Widgets from "./lib/Widgets.svelte";
    import Sidebar from "./lib/Sidebar.svelte";
    import gridHelp from "svelte-grid/src/utils/helper.js";


    const id = () => "_" + Math.random().toString(36).substr(2, 9);
    const getItems = () => {
        return  [
            {
                6: gridHelp.item({
                    x: 0,
                    y: 0,
                    w: 2,
                    h: 2,
                    // fixed: Boolean,
                    // resizable: Boolean,
                    // draggable: Boolean,
                }),
                data: {color: "#fa0"},
                id: id(),
            },
            {
                6: gridHelp.item({
                    x: 3,
                    y: 0,
                    w: 2,
                    h: 2,
                }),
                data: {color: "#faf"},
                id: id(),
            },
            {
                6: gridHelp.item({
                    x: 0,
                    y: 2,
                    w: 2,
                    h: 2,
                }),
                data: {color: "#faf"},
                id: id(),
            },
        ];
    }

    let locked = $state(false);
    let items = $state(getItems());
    $inspect(items);

    const toggleLayoutLock = () => {
        locked = !locked;
        items = items.map(item => {
            const config = item[6];
            return {
                ...item,
                [6]: {
                    ...config,
                    fixed: locked,       // Lock position
                    resizable: !locked,  // Disable resize
                    draggable: !locked   // Disable drag
                }
            };
        });
    };

</script>

<div class="app">
    <Sidebar {locked} onToggle={toggleLayoutLock} />
    <Widgets {locked} bind:items={items}/>
</div>

<style>
    html {
        box-sizing: border-box;
    }
    .app {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100vh;

    }

</style>