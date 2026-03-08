<script>
    import { Lock, Menu, Moon, Sun, Settings, Unlock } from "lucide-svelte";
    import AddonSettings from "./settings/AddonSettings.svelte";
    import { getContext } from "svelte";
    import { APPLICATION_KEY } from "./storage/applicationContext.svelte.ts";

    let { locked, onToggle, children } = $props();
    let settingsDialog = $state();
    let isHoveringEdge = $state(false);
    let dockMode = $state(true);
    let isDrawerChecked = $state(false);

    const context = getContext(APPLICATION_KEY);
    let ThemeIcon = $derived.by(() => {
        if (
            context.settingsManager.settings.themes.active ===
            context.settingsManager.settings.themes.light
        ) {
            return Sun;
        } else {
            return Moon;
        }
    });
</script>

<svelte:window
    onkeydown={(event) => {
        if (!locked && event.key === "Escape") {
            onToggle();
        }
    }}
/>

<div class="drawer drawer-open h-screen overflow-hidden">
    <input
        bind:checked={isDrawerChecked}
        class="drawer-toggle"
        id="drawer-toggle"
        type="checkbox"
    />

    <div class="drawer-content h-full overflow-y-auto">
        <div
            class="fixed top-0 left-0 z-50 h-screen w-4 bg-transparent"
            onmouseenter={() => (isHoveringEdge = true)}
            role="presentation"
        ></div>

        {@render children()}
    </div>

    <div
        class={[
            "drawer-side is-drawer-close:overflow-visible backdrop-blur-xl",
            "transition-transform duration-100",
        ]}
        onmouseleave={() => (isHoveringEdge = false)}
        role="navigation"
        style:backdrop-filter="blur({context.settingsManager.settings.appearance
            .widgetBlurPx}px)"
    >
        <label
            aria-label="close sidebar"
            class="drawer-overlay"
            for="drawer-toggle"
        ></label>

        {#if dockMode}
            <div
                class={[
                    "rounded-box border-base-content/10 fixed top-1/2 left-4 z-50 w-16 -translate-y-1/2 border shadow-2xl backdrop-blur-xl",
                    "transition-transform duration-300 ease-in-out",
                    !isHoveringEdge && !isDrawerChecked
                        ? "-translate-x-[250%]"
                        : "translate-x-0",
                ]}
                style:background-color={`color-mix(in oklab, var(--color-base-100) ${context.settingsManager.settings.appearance.widgetOpacity}%, transparent)`}
            >
                {@render navbar()}
            </div>
        {:else}
            <div
                class={[
                    "is-drawer-close:w-15 is-drawer-open:w-64",
                    "text-base-content gap-y-4} flex min-h-full flex-col items-start",
                ]}
                style:background-color={`color-mix(in oklab, var(--color-base-100) ${context.settingsManager.settings.appearance.widgetOpacity}%, transparent)`}
            >
                {@render navbar()}
            </div>
        {/if}
    </div>
</div>

<AddonSettings
    bind:this={settingsDialog}
    onCancel={() => {}}
    onSubmit={() => {}}
/>

{#snippet navbar()}
    <ul class="menu flex w-full grow flex-col gap-y-2 p-1 py-2">
        <li>
            <label
                aria-label="open sidebar"
                class={[
                    "flex py-3",
                    "is-drawer-close:tooltip is-drawer-close:tooltip-right",
                    "is-drawer-close:items-center is-drawer-close:justify-center",
                ]}
                data-tip="Expand menu"
                for="drawer-toggle"
            >
                <Menu size={20} />
                <span class="is-drawer-close:hidden">Menu</span>
            </label>
        </li>

        <li>
            <button
                class={[
                    "flex py-3",
                    "is-drawer-close:tooltip is-drawer-close:tooltip-right",
                    "is-drawer-close:items-center is-drawer-close:justify-center",
                ]}
                data-tip="Toggle dark mode"
                onclick={() => {
                    context.toggleActiveTheme();
                }}
            >
                <ThemeIcon size={20} />
                <span class="is-drawer-close:hidden text-nowrap"
                    >Toggle Dark Mode</span
                >
            </button>
        </li>

        {#if dockMode}
            <li class="divider bg-base-content/10 my-1 h-0.5 w-full"></li>
        {:else}
            <li class="grow bg-transparent"></li>
        {/if}

        <li>
            <button
                class={[
                    "flex py-3",
                    "is-drawer-close:tooltip is-drawer-close:tooltip-right",
                    "is-drawer-close:items-center is-drawer-close:justify-center",
                    !locked && "text-accent-content bg-accent",
                ]}
                data-tip="Edit Mode"
                onclick={onToggle}
            >
                {#if locked}
                    <Lock size={20} />
                    <span class="is-drawer-close:hidden">Unlock</span>
                {:else}
                    <Unlock size={20} />
                    <span class="is-drawer-close:hidden">Lock</span>
                {/if}
            </button>
        </li>

        <li>
            <button
                class={[
                    "flex py-3",
                    "is-drawer-close:tooltip is-drawer-close:tooltip-right",
                    "is-drawer-close:items-center is-drawer-close:justify-center",
                ]}
                data-tip="Settings"
                onclick={() => {
                    settingsDialog.show();
                }}
            >
                <Settings size={20} />
                <span class="is-drawer-close:hidden">Settings</span>
            </button>
        </li>
    </ul>
{/snippet}
