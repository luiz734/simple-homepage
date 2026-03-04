<script>
    import DarkLightTheme from "./DarkLightTheme.svelte";
    import ImportExport from "./ImportExport.svelte";
    import SettingsSidebar from "./SettingsSidebar.svelte";
    import Layout from "./Layout.svelte";
    import { X } from "lucide-svelte";
    import Appearance from "./Appearance.svelte";

    let { onCancel, onSubmit } = $props();
    let dialog = $state();

    export function show() {
        dialog.showModal();
    }

    const sendForm = (event) => {
        event.preventDefault();
        const payload = {};
        onSubmit(payload);
    };

    const sectionsMapping = {
        "Import/Export": ImportExport,
        Themes: DarkLightTheme,
        divider: "divider",
        Layout: Layout,
        Appearance: Appearance,
    };
    let sections = Object.keys(sectionsMapping);
    let selected = $state(sections[0]);
    let SelectedComponent = $derived(sectionsMapping[selected]);
</script>

<dialog
    bind:this={dialog}
    class="modal"
    onkeydown={(e) => {
        if (e.key === "Escape") {
            e.stopPropagation();
            onSubmit();
        }
    }}
>
    <div
        class="overlay-panel bg-base-100 prevent-select flex h-5/6 w-5/7 gap-6 overflow-hidden"
    >
        <div
            class="bg-base-300 flex h-full min-h-0 w-64 shrink-0 flex-col overflow-auto p-6"
        >
            <SettingsSidebar bind:group={selected} {sections} />
        </div>

        <div class="flex flex-col flex-1 items-end grow-2 bg-base-100 ">
            <button
                class="btn btn-circle hover:bg-base-200 bg-base-100 text-base-content/50 border-none shadow-none outline-0"
                onclick={() => {
                    dialog.close();
                }}
            >
                <X />
            </button>

            <div
                class="flex flex-1 min-h-0 flex-col w-full overflow-auto py-6 md:px-8 lg:px-16 xl:px-40"
            >
                <div class="h-20 pb-10 text-xl font-bold">{selected}</div>

                <div class="">
                    <SelectedComponent></SelectedComponent>
                </div>

                <div class="h-20"></div>
            </div>


        </div>
    </div>
</dialog>
