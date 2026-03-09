<script lang="ts">
    import {
        Lock,
        Menu,
        Moon,
        Sun,
        Settings,
        Unlock,
        type Icon as IconType, PanelLeft,
    } from "lucide-svelte";
    import AddonSettings from "./settings/AddonSettings.svelte";
    import { getContext, type Snippet } from "svelte";
    import {
        APPLICATION_KEY,
        ApplicationContextSvelte,
    } from "./storage/applicationContext.svelte";
    import { derived } from "svelte/store";

    interface ComponentProps {
        locked: boolean;
        onToggle: () => void;
        children: Snippet;
    }

    interface ActionItem {
        icon: typeof IconType;
        tooltip: string;
        label: string;
        onClick: (event: MouseEvent) => void;
        activeFunc: () => boolean;
    }

    let { locked, onToggle, children }: ComponentProps = $props();

    let settingsDialog: AddonSettings | undefined = $state();
    let isHoveringEdge: boolean = $state(false);

    let isDrawerChecked: boolean = $state(false);


    const context = getContext<ApplicationContextSvelte>(APPLICATION_KEY);

    let blurValuePx: number = $derived(
        context.settingsManager.settings.appearance.widgetBlurPx,
    );
    let opacityValue: number = $derived(
        context.settingsManager.settings.appearance.widgetOpacity,
    );
    let dockMode: boolean = $derived(context.settingsManager.settings.general.dockModeEnabled);

    let ThemeIcon = $derived.by(() => {
        if (
            context.settingsManager.settings.themes.active ===
            context.settingsManager.settings.themes.light
        ) {
            return Sun;
        }
        return Moon;
    });

    const actions: ActionItem[] = $derived([
        {
            icon: ThemeIcon,
            tooltip: "Toggle dark mode",
            label: "Toggle Dark Mode",
            onClick: () => {
                context.toggleActiveTheme();
            },
            activeFunc: () => false
        },
        {
            icon: PanelLeft,
            tooltip: "Toggle Dock",
            label: "Toggle Dock",
            onClick: () => {
                context.toggleDockMode();
                // This makes the hover area visible
                // when the user change to dock mode
                // with the sidebar expanded
                isDrawerChecked = false;
            },
            activeFunc: () => dockMode
        },
        {
            icon: null,
            tooltip: "",
            label: "",
            onClick: () => {},
            activeFunc: () => false
        },
        {
            icon: locked ? Lock : Unlock,
            tooltip: "Edit Mode",
            label: locked ? "Unlock" : "Lock",
            onClick: onToggle,
            activeFunc: () => !locked
        },
        {
            icon: Settings,
            tooltip: "Settings",
            label: "Settings",
            onClick: () => {
                settingsDialog?.show();
            },
            activeFunc: () => false
        },
    ]);

    function handleKeydown(event: KeyboardEvent): void {
        if (!locked && event.key === "Escape") {
            onToggle();
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

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
        style:backdrop-filter="blur({blurValuePx}px)"
    >
        <label
            aria-label="close sidebar"
            class="drawer-overlay"
            for="drawer-toggle"
        ></label>

        {#if dockMode}
            <div
                class={[
                    "rounded-box rounded-l-none border-base-content/10 fixed top-1/2 left-0 z-50 w-16 -translate-y-1/2 border",
                    "transition-transform duration-200 ease-in-out",
                    !isHoveringEdge
                        ? "-translate-x-[250%]"
                        : "translate-x-0",
                ]}
                style:background-color={`color-mix(in oklab, var(--color-base-100) ${100}%, transparent)`}
            >
                {@render navbar()}
            </div>
        {:else}
            <div
                class={[
                    "is-drawer-close:w-15 is-drawer-open:w-64",
                    "text-base-content flex min-h-full flex-col items-start gap-y-4",
                ]}
                style:background-color={`color-mix(in oklab, var(--color-base-100) ${opacityValue}%, transparent)`}
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

        <!-- First item: Expand Action -->
        {#if !dockMode}
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
        {/if}

        <!-- Other items -->
        {#each actions as action}
            {@const IconComponent = action.icon}
            {@const isSpacer = action.icon === null}
            {@const bgColor = action.activeFunc() ? "bg-accent" : ""}

            {#if isSpacer && !dockMode}
                <li class="flex-1 bg-transparent"> </li>
            {:else}
                <li>
                    <button class={[
                        isSpacer && dockMode && "hidden",
                        bgColor,
                        "flex py-3",
                        "is-drawer-close:tooltip is-drawer-close:tooltip-right",
                        "is-drawer-close:items-center is-drawer-close:justify-center",
                ]}
                            data-tip={action.tooltip}
                            onclick={action.onClick}
                    >
                        <IconComponent size={20} />
                        <span class="is-drawer-close:hidden text-nowrap"
                        >{action.label}</span
                        >
                    </button>
                </li>
            {/if}


        {/each}

    </ul>
{/snippet}
