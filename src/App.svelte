<script>
    import Widgets from "./lib/Widgets.svelte";
    import Sidebar from "./lib/Sidebar.svelte";
    import {ApplicationState, APPLICATION_KEY, defaultData} from "./lib/storage/database.svelte.js";
    import {setContext, getContext} from "svelte";


    const widgetsData = defaultData.widgets;
    const applicationState = new ApplicationState(widgetsData);
    setContext(APPLICATION_KEY, applicationState);

    const context = getContext(APPLICATION_KEY);
    // let widgets = $derived(context.widgets);

    let locked = $state(true);

    const toggleLayoutLock = () => {
        locked = !locked;
        context.updateWidgets(context.widgets.map((widget) => {
            return {
                ...widget,
                columnLayout: {
                    ...widget.columnLayout,
                    6: {
                        fixed: locked,
                        resizable: !locked,
                        draggable: !locked
                    }
                }
            }
        }));
    };

</script>

<div class="app">
    <Sidebar {locked} onToggle={toggleLayoutLock}/>
    <Widgets {locked} bind:items={context.widgets}/>
    <!--    <ShortcutsConfig/>-->
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