<script>
    import { getContext } from "svelte";
    import { APPLICATION_KEY } from "../storage/applicationContext.svelte.ts";

    const minColumns = 4;
    const maxColumns = 13;
    const columnsRange = maxColumns - minColumns;

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
                    placeholder="default 4"
                    type="number"
                />
                <p class="label">Gap in pixels on X axis</p>
            </div>

            <div class="flex w-full flex-col">
                <label for="gapY"> Gap Y</label>
                <input
                    bind:value={context.settings.layout.gapY}
                    class="input"
                    id="gapY"
                    min="0"
                    placeholder="default 4"
                    type="number"
                />
                <p class="label">Gap in pixels on Y axis</p>
            </div>
        </div>
    </fieldset>

    <!--    <fieldset class="fieldset w-full max-w-xs">-->
    <!--        <legend class="fieldset-legend">Columns</legend>-->
    <!--        <input-->
    <!--            bind:value={numberOfColumns}-->
    <!--            class="range"-->
    <!--            max={maxColumns - 1}-->
    <!--            min={minColumns}-->
    <!--            step="1"-->
    <!--            type="range"-->
    <!--        />-->
    <!--        <div class="mt-2 flex justify-between px-2.5 text-xs">-->
    <!--            {#each Array(columnsRange) as _, i}-->
    <!--                <span>{i + minColumns}</span>-->
    <!--            {/each}-->
    <!--        </div>-->
    <!--&lt;!&ndash;        <p class="label">The number of widgets columns</p>&ndash;&gt;-->
    <!--    </fieldset>-->
    <!--    {numberOfColumns}-->
</div>
