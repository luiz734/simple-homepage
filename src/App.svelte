<script>
    import Widgets from "./lib/Widgets.svelte";
    import Sidebar from "./lib/Sidebar.svelte";
    import { setContext, getContext } from "svelte";
    import "./app.css";
    import {
        ApplicationContextSvelte,
        APPLICATION_KEY,
    } from "./lib/storage/applicationContext.svelte.ts";

    const appContext = new ApplicationContextSvelte();

    $effect(() => {
        // Create a self-executing async function to use await
        (async () => {
            await context.loadStorageOrDefault();
        })();
    });

    setContext(APPLICATION_KEY, appContext);
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
                    layout: {
                        ...widget.layout,
                        fixed: locked,
                        resizable: !locked,
                        draggable: !locked,
                    },
                };
            }),
        );
    };
</script>

{#if context.isLoaded}
    <div class="app" data-theme={context.settings.themes.active}>
        <Sidebar {locked} onToggle={toggleLayoutLock}>
            {#key context.settings.layout.numberOfColumns}
                <Widgets
                    bind:items={context.libraryFormatWidgets}
                    {locked}
                    restoreWidgets={() => {
                        context.restoreSnapshot();
                    }}
                />
            {/key}
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
