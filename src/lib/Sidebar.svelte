<script>
    import {
        ChevronRight,
        Lock,
        Menu,
        Moon,
        Sun,
        Settings,
        Unlock,
        User,
    } from "lucide-svelte";
    import AddonSettings from "./settings/AddonSettings.svelte";
    import { getContext } from "svelte";
    import { APPLICATION_KEY } from "./storage/applicationContext.svelte.ts";

    let { locked, onToggle, children } = $props();
    let settingsDialog = $state();

    const context = getContext(APPLICATION_KEY);
    let ThemeIcon = $derived.by(() => {
        if (context.settings.themes.active === context.settings.themes.light) {
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
            class="is-drawer-close:w-14 is-drawer-open:w-64 bg-base-100 text-base-content flex min-h-full flex-col items-start gap-y-4"
        >
            <ul class="menu flex w-full grow flex-col gap-y-3">
                <li>
                    <label
                        aria-label="open sidebar"
                        class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
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
                            "is-drawer-close:tooltip is-drawer-close:tooltip-right",
                        ]}
                        data-tip="Toggle dark mode"
                        onclick={() => {
                            context.toggleActiveTheme();
                        }}
                    >
                        <ThemeIcon size={20} />
                        <span class="is-drawer-close:hidden text-nowrap">Toggle Dark Mode</span>
                    </button>
                </li>

                <li class="grow bg-transparent"></li>

                <li>
                    <button
                        class={[
                            "is-drawer-close:tooltip is-drawer-close:tooltip-right",
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
                        class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
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
    onSubmit={() => {
        // context.reorganizeWidgets()
    }}
/>
