<script>
    import { Lock, Menu, Moon, Sun, Settings, Unlock } from "lucide-svelte";
    import AddonSettings from "./settings/AddonSettings.svelte";
    import { getContext } from "svelte";
    import { APPLICATION_KEY } from "./storage/applicationContext.svelte.ts";

    let { locked, onToggle, children } = $props();
    let settingsDialog = $state();

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
    <input class="drawer-toggle" id="drawer-toggle" type="checkbox" />

    <div class="drawer-content h-full overflow-y-auto">
        {@render children()}
    </div>

    <div class="drawer-side is-drawer-close:overflow-visible">
        <label
            aria-label="close sidebar"
            class="drawer-overlay"
            for="drawer-toggle"
        ></label>

        <div
            class="is-drawer-close:w-16 is-drawer-open:w-64 bg-base-100 text-base-content flex min-h-full flex-col items-start gap-y-4"
        >
            <ul class="menu flex w-full grow flex-col gap-y-3">
                <li>
                    <label
                        aria-label="open sidebar"
                        class={[
                            "flex",
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
                            "flex",
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

                <li class="grow bg-transparent"></li>

                <li>
                    <button
                        class={[
                            "flex",
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
                            "flex",
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
        </div>
    </div>
</div>

<AddonSettings
    bind:this={settingsDialog}
    onCancel={() => {}}
    onSubmit={() => {}}
/>
