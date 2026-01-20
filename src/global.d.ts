declare module "svelte-grid" {
    import type { ComponentType, SvelteComponent } from "svelte";

    // Treat the Grid component as a generic Svelte Component
    const Grid: ComponentType<SvelteComponent>;
    export default Grid;
}

// If you import helper too
declare module "svelte-grid/src/utils/helper.js" {
    const helper: any;
    export default helper;
}