<script>
    import Widgets from "./lib/Widgets.svelte";
    import Sidebar from "./lib/Sidebar.svelte";
    import { setContext, getContext, onMount } from "svelte";
    import "./app.css";
    import {
        ApplicationContextSvelte,
        APPLICATION_KEY,
    } from "./lib/storage/applicationContext.svelte.ts";
    import { settingsReadWrite } from "./lib/storage/SettingsReadWriter.ts";

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
        if (locked) {
            context.saveSnapshot();
        } else {
            context.clearSnapshot();
        }
        console.log($state.snapshot(context.settings));
        locked = !locked;
        context.setWidgetsLock(locked);
    };

    const onWallpaperMissing = () => {
        console.warn("Wallpaper not found in IndexDB. Upload it again.")
        context.settingsManager.settings.wallpaperUrl = ""
    }
</script>

{#if context.isLoaded}
    <div
        class="app"
        data-theme={context.settingsManager.settings.themes.active}
    >
        <!-- method 1 -->
        {#if context.settingsManager.settings.wallpaperUrl !== ""}
            <img
                class="absolute inset-0 z-0 h-full w-full object-cover object-center"
                src={context.settingsManager.settings.wallpaperUrl}
                alt="Background"
                onerror={onWallpaperMissing}
            />
            <div class="absolute inset-0 z-0 bg-black/30 backdrop-blur-sm"></div>
        {:else}
            <div class="absolute inset-0 z-0 bg-base-300"></div>
        {/if}




        <Sidebar {locked} onToggle={toggleLayoutLock}>
            {#key context.settingsManager.settings.layout.numberOfColumns + context.settingsManager.settings.layout.rowHeight}
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

    :global(.svlt-grid-shadow) {
        background: rgb(from var(--color-primary) r g b / 0.3) !important;
    }
    :global(.svlt-grid-container) {
        background: transparent !important;
    }
</style>
