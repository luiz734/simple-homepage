<script>
    import { getContext } from "svelte";
    import { APPLICATION_KEY } from "../storage/applicationContext.svelte.ts";
    import { settingsReadWrite } from "../storage/SettingsReadWriter.ts";
    import { Copy } from "lucide-svelte";

    const context = getContext(APPLICATION_KEY);

    async function handleFileSelect(event) {
        const files = event.target.files;
        if (!files || files.length === 0) {
            console.log("No files uploaded");
            return;
        }

        const file = files[0];
        try {
            await settingsReadWrite.setUserWallpaper(file);
            context.settingsManager.settings.wallpaperUrl = await settingsReadWrite.getUserWallpaper();
        } catch (error) {
            console.error("Error loading image:", error);
        }
    }

    // let tintColor = $state("#000000");
    // let opacity = $state(50);
    let opacityNormalized = $derived(context.settingsManager.settings.appearance.tintOpacity / 100.0);

</script>

<div class="flex flex-col gap-3">
    <fieldset class="fieldset">
        <legend class="fieldset-legend">Wallpaper</legend>
        <input
            accept="image/png, image/jpeg"
            class="file-input"
            id="importWallpaper"
            name="wallpaper"
            onchange={handleFileSelect}
            type="file"
        />
        <p class="label">Maximum size is 10MB.</p>
    </fieldset>

    <fieldset class="fieldset">
        <legend class="fieldset-legend">Tint</legend>

        <div class="flex gap-x-4">
            <div class="flex flex-col flex-1">
                <div class="flex flex-col">
                    <label for="tintOpacity"> Opacity ({context.settingsManager.settings.appearance.tintOpacity}%) </label>
                    <input bind:value={context.settingsManager.settings.appearance.tintOpacity} class="range range-xs" id="tintOpacity" max="100" min="0" step="1" type="range" />
                    <p class="label">Tint opacity.</p>
                </div>


                <div class="flex flex-col">
                    <label for="tintColor"> Color </label>
                    <div class="flex join">
                        <input bind:value={context.settingsManager.settings.appearance.tintColor}
                               class="w-32 join-item input cursor-pointer" id="tintColor" type="color" />

                        <input bind:value={context.settingsManager.settings.appearance.tintColor} class="input input-md join-item sm"
                               placeholder="#ffffff" />

                        <button class="btn btn-outline border-base-content/20 join-item rounded-r-full"
                        onclick={() => {
                            navigator.clipboard.writeText(context.settingsManager.settings.appearance.tintColor);
                        }}
                        > <Copy size={15}/> </button>
                    </div>
                    <p class="label">Tint color.</p>
                </div>

            </div>

            <div class="card flex-1 h-full relative ">
                <img
                    alt="Background preview"
                    class="w-full h-auto block"
                    onerror={() => {}}
                    src={context.settingsManager.settings.wallpaperUrl}
                />
                <div class="absolute inset-0"
                     style:background-color={context.settingsManager.settings.appearance.tintColor}
                     style:opacity={opacityNormalized}>
                </div>

                <div
                    class="card flex bg-base-content absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 justify-center"
                    style:backdrop-filter="blur({context.settingsManager.settings.appearance.widgetBlurPx}px)"
                    style:background-color={`color-mix(in oklab, var(--color-base-100) ${context.settingsManager.settings.appearance.widgetOpacity}%, transparent)`}>

                    <p class="block w-full text-center text-base-content text-xl"> Widget</p>
                </div>
            </div>
        </div>
    </fieldset>


    <fieldset class="fieldset">
        <legend class="fieldset-legend">Blur</legend>

        <div class="flex-col gap-x-4">
            <div class="flex flex-col flex-1">
                <div class="flex flex-col">
                    <label for="blurAmount"> Amount ({context.settingsManager.settings.appearance.widgetBlurPx}px) </label>
                    <input bind:value={context.settingsManager.settings.appearance.widgetBlurPx} class="range range-xs" id="blurAmount" max="24" min="0" step="1" type="range" />
                    <p class="label">Amount of blur in pixels.</p>
                </div>
            </div>

            <div class="card flex flex-1">
                <div class="flex flex-col">
                    <label for="widgetOpacity"> Widget Opacity ({context.settingsManager.settings.appearance.widgetOpacity}%) </label>
                    <input bind:value={context.settingsManager.settings.appearance.widgetOpacity} class="range range-xs" id="widgetOpacity" max="100" min="0" step="1" type="range" />
                    <p class="label">Opacity of the widget.</p>
                </div>
            </div>
        </div>


    </fieldset>

</div>
