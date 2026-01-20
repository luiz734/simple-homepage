<script>
    import { getContext } from "svelte";
    import { APPLICATION_KEY } from "../storage/database.svelte.js";
    import PalettePreview from "./PalettePreview.svelte";

    const lightThemes = ["light", "cupcake", "bumblebee", "emerald"];
    const darkThemes = ["dark", "synthwave", "cyberpunk", "halloween"];

    let context = getContext(APPLICATION_KEY);

    const paletteProps = "btn h-16 w-16";
</script>

<div class="justify- flex flex-wrap gap-4 align-top prevent-select">
    {#each lightThemes as theme}
        <PalettePreview {theme} />
    {/each}
</div>

<div class="justify- flex flex-wrap gap-4 align-top prevent-select">
    {#each darkThemes as theme}
        <PalettePreview {theme} />
    {/each}
</div>
