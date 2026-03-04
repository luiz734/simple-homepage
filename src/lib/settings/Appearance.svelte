<script>
    import { getContext } from "svelte";
    import { APPLICATION_KEY } from "../storage/applicationContext.svelte.ts";
    import { settingsReadWrite } from "../storage/SettingsReadWriter.ts";
    import { Copy, Delete, Trash } from "lucide-svelte";

    const context = getContext(APPLICATION_KEY);

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
    <fieldset class="fieldset">
        <legend class="fieldset-legend"> Preview </legend>
        <div
            class="card border-base-content relative aspect-video max-w-80 flex-1 rounded-2xl border-2"
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
                style:backdrop-filter="blur({context.settingsManager.settings
                    .appearance.widgetBlurPx}px)"
                style:background-color={`color-mix(in oklab, var(--color-base-100) ${context.settingsManager.settings.appearance.widgetOpacity}%, transparent)`}
                style:border-radius={context.settingsManager.settings.layout
                    .widgetsBorder.useFromTheme
                    ? null
                    : `${context.settingsManager.settings.layout.widgetsBorder.valuePx}px`}
            >
                <p class="text-base-content block w-full text-center text-xl">
                    Widget
                </p>
            </div>
        </div>
    </fieldset>

    <fieldset class="fieldset">
        <!--        <legend class="fieldset-legend">Wallpaper</legend>-->
        <div class="join">
            <input
                accept="image/png, image/jpeg"
                class="file-input"
                id="importWallpaper"
                name="wallpaper"
                onchange={handleFileSelect}
                type="file"
            />
            {#if wallpaper}
                <button
                    class="btn btn-outline border-base-content/20 w-14 rounded-r-full"
                    onclick={async () => {
                        await settingsReadWrite.removeUserWallpaper();
                        context.settingsManager.settings.wallpaperUrl = "";
                    }}
                >
                    <Trash size={15}></Trash>
                </button>
            {/if}
        </div>
        <p class="label">Maximum size is 10MB.</p>
    </fieldset>

    <div class="flex gap-x-4 items-center">
        <fieldset class="fieldset flex-1">
            <legend class="fieldset-legend">Color</legend>
            <div class="join flex">
                <input
                    bind:value={
                        context.settingsManager.settings.appearance.tintColor
                    }
                    class="join-item input w-32 cursor-pointer"
                    id="tintColor"
                    type="color"
                />

                <input
                    bind:value={
                        context.settingsManager.settings.appearance.tintColor
                    }
                    class="input input-md join-item"
                    placeholder="#ffffff"
                    type="text"
                />

                <button
                    class="btn btn-outline border-base-content/20 w-14 join-item rounded-r-full"
                    onclick={() => {
                        navigator.clipboard.writeText(
                            context.settingsManager.settings.appearance
                                .tintColor,
                        );
                    }}
                >
                    <Copy size={15} />
                </button>
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

    <div class="divider"></div>
    <span class="text-base-content font-bold"> Widget </span>

    <fieldset class="fieldset">
        <legend class="fieldset-legend" for="blurAmount">
            Amount ({context.settingsManager.settings.appearance
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
