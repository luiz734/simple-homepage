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
        class="overlay-panel  bg-base-100 prevent-select h-5/6 w-5/8 flex gap-6 overflow-hidden p-0"
    >

        <div
            class="bg-base-300 flex h-full min-h-0 w-64 shrink-0 flex-col overflow-auto p-6"
        >
            <SettingsSidebar bind:group={selected} {sections} />
        </div>

        <div
            class="bg-base-100 flex min-h-0 grow-2 flex-col overflow-auto py-6 md:px-8 lg:px-16 xl:px-32
                    md:bg-red-500 lg:bg-blue-500 xl:bg-green-500
"
        >
            <div class="h-20 pb-10 text-xl font-bold">{selected}</div>

            <div class="grow">
                <SelectedComponent></SelectedComponent>
            </div>

            <div class="h-20"></div>
        </div>

        <button
            class="btn btn-circle position-absolute hover:bg-base-200 bg-base-100 top-0 right-0 border-none shadow-none outline-0 text-base-content/50"
            onclick={() => {dialog.close()}}
        >
            <X />
        </button>
    </div>
</dialog>
