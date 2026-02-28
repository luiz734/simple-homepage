<script>
    import { getContext } from "svelte";
    import { APPLICATION_KEY } from "../storage/applicationContext.svelte.ts";

    const context = getContext(APPLICATION_KEY);
</script>

<div class="flex flex-col gap-3">
    <fieldset class="fieldset">
        <legend class="fieldset-legend">Columns</legend>
        <input
            bind:value={context.settings.layout.numberOfColumns}
            class="input"
            min="1"
            placeholder="default 6"
            type="number"
        />
        <p class="label">The number of widgets columns</p>
    </fieldset>

    <fieldset class="fieldset">
        <legend class="fieldset-legend">Widgets Gap</legend>

        <div class="flex w-full gap-4">
            <div class="flex w-full flex-col">
                <label for="gapX"> Gap X</label>
                <input
                    bind:value={context.settings.layout.gapX}
                    class="input"
                    id="gapX"
                    min="0"
                    placeholder="default 6"
                    step="2"
                    type="number"
                />
                {#if context.settings.layout.gapX % 2 !== 0}
                    <p class="label text-error">
                        Odd numbers may not align correctly.
                    </p>
                {:else}
                    <p class="label">Gap in pixels on X axis</p>
                {/if}
            </div>

            <div class="flex w-full flex-col">
                <label for="gapY"> Gap Y</label>
                <input
                    bind:value={context.settings.layout.gapY}
                    class="input"
                    id="gapY"
                    min="0"
                    placeholder="default 6"
                    step="2"
                    type="number"
                />
                {#if context.settings.layout.gapY % 2 !== 0}
                    <p class="label text-error">
                        Odd numbers may not align correctly.
                    </p>
                {:else}
                    <p class="label">Gap in pixels on X axis</p>
                {/if}
            </div>
        </div>
    </fieldset>

    <fieldset class="fieldset">
        <legend class="fieldset-legend">Widget Border Radius</legend>

        <div class="flex w-full gap-4">
            <div class="flex w-full flex-col justify-center">
                <!--                <label for="options"> Widget Border Radius </label>-->
                <div class="flex w-full gap-4">
                    <div class="join flex flex-1">
                        <input
                            aria-label="From theme"
                            bind:group={
                                context.settings.layout.widgetsBorder
                                    .useFromTheme
                            }
                            class="join-item btn flex-1"
                            name="options"
                            type="radio"
                            value={true}
                        />
                        <input
                            aria-label="Custom"
                            bind:group={
                                context.settings.layout.widgetsBorder
                                    .useFromTheme
                            }
                            class="join-item btn flex-1"
                            name="options"
                            type="radio"
                            value={false}
                        />
                    </div>
                </div>
                <!--                <p class="label">Border radius in pixels.</p>-->
            </div>

            <!-- Only enabled for custom values-->
            <div class="flex w-full flex-col">
                <label for="borderRadius"> Widget Border Radius </label>
                <input
                    bind:value={context.settings.layout.widgetsBorder.valuePx}
                    class="input"
                    disabled={context.settings.layout.widgetsBorder
                        .useFromTheme}
                    id="borderRadius"
                    min="0"
                    placeholder="Default 8"
                    step="1"
                    type="number"
                />
                <p class="label">Border radius in pixels.</p>
            </div>
        </div>
    </fieldset>

    <fieldset class="fieldset">
        <legend class="fieldset-legend">Widget Height Step</legend>
        <input
            bind:value={context.settings.layout.rowHeight}
            class="input"
            min="1"
            placeholder="default 6"
            type="number"
        />
        <p class="label">Widget step resizing vertically</p>
    </fieldset>
</div>
