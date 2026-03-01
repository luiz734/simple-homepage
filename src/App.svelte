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
    const defaultWallpaperPath = "src/assets/wallpaper.jpg"

    let wallpaperUrl = $state("");

    onMount(async () => {
        try {
            wallpaperUrl = await settingsReadWrite.getUserWallpaper()
        } catch (error) {
            console.error(error);

            try {
                const response = await fetch(defaultWallpaperPath);
                const fallbackBlob = await response.blob();
                wallpaperUrl = URL.createObjectURL(fallbackBlob);
            } catch (fallbackError) {
                console.error("Failed to load fallback wallpaper:", fallbackError);
            }

        }
    });

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
</script>

{#if context.isLoaded}
    <div
        class="app"
        data-theme={context.settingsManager.settings.themes.active}
    >
        <!-- method 1 -->
        {#if wallpaperUrl !== ""}
            <img
                class="absolute inset-0 z-0 h-full w-full object-cover object-center"
                src={wallpaperUrl}
                alt="Background"
            />
        {/if}

        <div class="absolute inset-0 z-0 bg-black/30 backdrop-blur-sm"></div>

        <!-- method 2 -->
<!--        <img-->
<!--            class={[-->
<!--                "absolute inset-0 z-0 h-full w-full object-cover object-center",-->
<!--                "scale-105 blur-sm brightness-50",-->
<!--            ]}-->
<!--            src={wallpaper}-->
<!--            alt="Background"-->
<!--        />-->

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
