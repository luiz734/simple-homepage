<script>
    import Widgets from "./lib/Widgets.svelte";
    import Sidebar from "./lib/Sidebar.svelte";
    import {
        ApplicationState,
        APPLICATION_KEY,
    } from "./lib/storage/database.svelte.js";
    import { setContext, getContext } from "svelte";
    import "./app.css";

    const applicationState = new ApplicationState();

    $effect(() => {
        // We create a self-executing async function to use await
        (async () => {
            await applicationState.loadStorageOrDefault();
        })();
    });

    setContext(APPLICATION_KEY, applicationState);
    const context = getContext(APPLICATION_KEY);


    let locked = $state(true);

    const toggleLayoutLock = () => {
        if (!context.widgets) return;

        if (locked) {
            context.saveSnapshot();
        } else {
            context.clearSnapshot();
        }
        console.log($state.snapshot(context.settings));
        locked = !locked;
        context.updateWidgets(
            context.widgets.map((widget) => {
                return {
                    ...widget,
                    columnLayout: {
                        ...widget.columnLayout,
                        6: {
                            fixed: locked,
                            resizable: !locked,
                            draggable: !locked,
                        },
                    },
                };
            }),
        );
    };
</script>

{#if context.isLoaded}
    <div class="app" data-theme={context.settings.themes.active}>
        <Sidebar {locked} onToggle={toggleLayoutLock}>
            <Widgets
                bind:items={context.widgets}
                {locked}
                restoreWidgets={() => {
                    context.restoreSnapshot();
                }}
            />
        </Sidebar>
    </div>
{/if}

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
