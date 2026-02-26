<script>
    import DarkLightTheme from "./DarkLightTheme.svelte";
    import ImportExport from "./ImportExport.svelte";
    import SettingsSidebar from "./SettingsSidebar.svelte";
    import Layout from "./Layout.svelte";

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
        class="modal-box bg-base-100 prevent-select flex h-5/12 min-h-4/6 w-11/12 max-w-6xl gap-6 overflow-hidden p-0"
    >
        <div
            class="bg-base-300 flex h-full min-h-0 w-64 shrink-0 flex-col overflow-auto p-6"
        >
            <SettingsSidebar bind:group={selected} {sections} />
        </div>

        <div
            class="bg-base-100 flex min-h-0 grow-2 flex-col overflow-auto py-6 lg:px-20"
        >
            <div class="h-20 pb-10 text-xl font-bold">{selected}</div>

            <div class="grow">
                <SelectedComponent></SelectedComponent>
            </div>

            <div class="h-20"></div>
        </div>
    </div>
</dialog>
