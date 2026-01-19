<script>
    import {
        ChevronRight,
        Lock,
        Menu,
        Settings,
        Unlock,
        User,
    } from "lucide-svelte";
    import AddonSettings from "./settings/AddonSettings.svelte";

    let { locked, onToggle, children } = $props();
    let settingsDialog = $state();
</script>

<div class="drawer drawer-open">
    <input class="drawer-toggle" id="drawer-toggle" type="checkbox" />

    <div class="drawer-content overflow-scroll">
        {@render children()}
    </div>

    <div class="drawer-side is-drawer-close:overflow-visible">
        <label
            aria-label="close sidebar"
            class="drawer-overlay"
            for="drawer-toggle"
        ></label>

        <div
            class="bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64 flex min-h-full flex-col items-start gap-y-4"
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

                <li class="grow bg-transparent"></li>

                <li>
                    <button
                        class={[
                            "is-drawer-close:tooltip is-drawer-close:tooltip-right",
                            !locked && "text-primary",
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
    onSubmit={() => {}}
/>
