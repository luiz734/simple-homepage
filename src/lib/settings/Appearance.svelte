<script>
    import { getContext } from "svelte";
    import { APPLICATION_KEY } from "../storage/applicationContext.svelte.ts";
    import { settingsReadWrite } from "../storage/SettingsReadWriter.ts";

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

</script>

<div class="flex flex-col gap-3">
    <fieldset class="fieldset">
        <legend class="fieldset-legend">Wallpaper</legend>
        <input
            class="file-input"
            accept="image/png, image/jpeg"
            id="importWallpaper"
            name="wallpaper"
            onchange={handleFileSelect}
            type="file"
        />
        <p class="label">Maximum size is 10MB.</p>
    </fieldset>
</div>
