<script>
    import { getContext } from "svelte";
    import { APPLICATION_KEY } from "../storage/applicationContext.svelte.ts";
    import PalettePreview from "./PalettePreview.svelte";

    const lightThemes = [
        "light",
        "cupcake",
        "bumblebee",
        "emerald",
        "corporate",
        "retro",
        "valentine",
        "garden",
        "lofi",
        "pastel",
        "fantasy",
        "wireframe",
        "cmyk",
        "autumn",
        "acid",
        "lemonade",
        "winter",
        "nord",
        "caramellatte",
        "silk",
    ];
    const darkThemes = [
        "dark",
        "synthwave",
        "cyberpunk",
        "halloween",
        "forest",
        "aqua",
        "black",
        "luxury",
        "dracula",
        "business",
        "night",
        "coffee",
        "dim",
        "sunset",
        "abyss",
    ];

    let context = getContext(APPLICATION_KEY);

    // Snapshot state
    let lightTheme = $state(context.settings.themes.light);
    let darkTheme = $state(context.settings.themes.dark);

    // Trackers to prevent overriding the active theme immediately on mount
    let currentLight = context.settings.themes.light;
    let currentDark = context.settings.themes.dark;

    $effect(() => {
        if (lightTheme !== currentLight) {
            currentLight = lightTheme;
            context.settings.themes.light = lightTheme;
            context.settings.themes.active = lightTheme;
        }
    });

    $effect(() => {
        if (darkTheme !== currentDark) {
            currentDark = darkTheme;
            context.settings.themes.dark = darkTheme;
            context.settings.themes.active = darkTheme;
        }
    });
</script>

<div class="flex h-full w-full flex-col gap-4">
    <span class="text-base-content font-bold"> Light Theme </span>
    <div class="prevent-select flex grow flex-wrap gap-4 align-top">
        {#each lightThemes as theme}
            <PalettePreview
                {theme}
                name="theme_selection_light"
                bind:group={lightTheme}
            />
        {/each}
    </div>

    <div class="divider"></div>

    <span class="text-base-content font-bold"> Dark Theme </span>
    <div class="prevent-select flex grow flex-wrap gap-4 align-top">
        {#each darkThemes as theme}
            <PalettePreview
                {theme}
                name="theme_selection_dark"
                bind:group={darkTheme}
            />
        {/each}
    </div>
</div>
