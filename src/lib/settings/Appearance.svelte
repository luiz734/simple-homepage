<script>
    import { getContext } from "svelte";
    import { APPLICATION_KEY } from "../storage/applicationContext.svelte.ts";
    import { settingsReadWrite } from "../storage/SettingsReadWriter.ts";
    import { Copy, Delete, Trash } from "lucide-svelte";

    const context = getContext(APPLICATION_KEY);

    let lightWallpaper = $derived(
        context.settingsManager.settings.wallpaperUrl,
    );
    let darkWallpaper = $derived(context.settingsManager.settings.wallpaperUrl);
    let wallpaper = $derived(context.settingsManager.settings.wallpaperUrl);

    async function handleFileSelect(event) {
        const files = event.target.files;
        if (!files || files.length === 0) {
            console.log("No files uploaded");
            return;
        }

        const file = files[0];
        try {
            await settingsReadWrite.setUserWallpaper(file);
            context.settingsManager.settings.wallpaperUrl =
                await settingsReadWrite.getUserWallpaper();
        } catch (error) {
            console.error("Error loading image:", error);
        }
    }

    // let tintColor = $state("#000000");
    // let opacity = $state(50);
    let opacityNormalized = $derived(
        context.settingsManager.settings.appearance.tintOpacity / 100.0,
    );
</script>

<div class="flex flex-col gap-3">
    <!--    <div class="divider"></div>-->
    <span class="text-base-content font-bold"> Wallpaper </span>

    <div class="flex flex-wrap justify-between gap-16">
        {@render wallpaper_fieldset("Light", lightWallpaper)}
        {@render wallpaper_fieldset("Dark", darkWallpaper)}
    </div>

    <div class="divider"></div>
    <span class="text-base-content font-bold"> Widget </span>

    <fieldset class="fieldset">
        <legend class="fieldset-legend" for="blurAmount">
            Blur Amount ({context.settingsManager.settings.appearance
                .widgetBlurPx}px)
        </legend>
        <input
            bind:value={
                context.settingsManager.settings.appearance.widgetBlurPx
            }
            class="range range-primary"
            id="blurAmount"
            max="24"
            min="0"
            step="1"
            type="range"
        />
        <p class="label">Amount of blur in pixels.</p>
    </fieldset>

    <fieldset class="fieldset">
        <legend class="fieldset-legend" for="widgetOpacity">
            Widget Opacity ({context.settingsManager.settings.appearance
                .widgetOpacity}%)
        </legend>
        <input
            bind:value={
                context.settingsManager.settings.appearance.widgetOpacity
            }
            class="range range-primary"
            id="widgetOpacity"
            max="100"
            min="0"
            step="1"
            type="range"
        />
        <p class="label">Opacity of the widget.</p>
    </fieldset>
</div>

{#snippet wallpaper_fieldset(theme, wallpaper)}
    <div class="flex flex-1 flex-col">
        <fieldset class="fieldset">
            <legend class="fieldset-legend"> {theme} </legend>
            <div
                class="card border-base-content relative aspect-video flex-1 rounded-2xl border-2"
            >
                {#if wallpaper}
                    <img
                        alt="Background preview"
                        class="block h-auto w-full rounded-2xl"
                        onerror={() => {}}
                        src={context.settingsManager.settings.wallpaperUrl}
                    />
                {/if}
                <div
                    class="absolute inset-0 h-auto w-full rounded-2xl"
                    style:background-color={context.settingsManager.settings
                        .appearance.tintColor}
                    style:opacity={opacityNormalized}
                ></div>

                <div
                    class="card bg-base-content absolute top-1/2 left-1/2 flex aspect-square h-1/2 min-h-24 min-w-24 -translate-x-1/2 -translate-y-1/2 justify-center"
                    style:backdrop-filter="blur({context.settingsManager
                        .settings.appearance.widgetBlurPx}px)"
                    style:background-color={`color-mix(in oklab, var(--color-base-100) ${context.settingsManager.settings.appearance.widgetOpacity}%, transparent)`}
                    style:border-radius={context.settingsManager.settings.layout
                        .widgetsBorder.useFromTheme
                        ? null
                        : `${context.settingsManager.settings.layout.widgetsBorder.valuePx}px`}
                >
                    <p
                        class="text-base-content block w-full text-center text-xl"
                    >
                        Widget
                    </p>
                </div>
            </div>
        </fieldset>

        <fieldset class="fieldset">
            <legend class="fieldset-legend">Wallpaper</legend>
            <div class="flex gap-3">
                <label class="btn btn-primary flex-1 cursor-pointer">
                    <span>Upload new</span>
                    <input
                        accept="image/png, image/jpeg"
                        class="hidden"
                        id="importWallpaper"
                        name="wallpaper"
                        onchange={handleFileSelect}
                        type="file"
                    />
                </label>

                <button
                    class="btn flex-1"
                    disabled={!wallpaper}
                    onclick={async () => {
                        await settingsReadWrite.removeUserWallpaper();
                        context.settingsManager.settings.wallpaperUrl = "";
                    }}
                >
                    Remove
                </button>
            </div>
            <p class="label">Maximum size is 10MB.</p>
        </fieldset>

        <fieldset class="fieldset flex-1">
            <legend class="fieldset-legend">Color</legend>
            <div class="flex w-full items-center gap-3">
                <label
                    class="btn relative flex-1 cursor-pointer"
                    style:background-color={context.settingsManager.settings
                        .appearance.tintColor}
                >
                    <span
                        >{context.settingsManager.settings.appearance
                            .tintColor}</span
                    >
                    <input
                        bind:value={
                            context.settingsManager.settings.appearance
                                .tintColor
                        }
                        class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        id="tintColor"
                        type="color"
                    />
                </label>
            </div>
            <p class="label">Tint color.</p>
        </fieldset>

        <fieldset class="fieldset flex-1">
            <legend class="fieldset-legend">
                Opacity ({context.settingsManager.settings.appearance
                    .tintOpacity}%)
            </legend>
            <input
                bind:value={
                    context.settingsManager.settings.appearance.tintOpacity
                }
                class="range range-md range-primary"
                id="tintOpacity"
                max="100"
                min="0"
                step="1"
                type="range"
            />
            <p class="label">Tint opacity.</p>
        </fieldset>
    </div>
{/snippet}
