<script>
    import { getContext } from "svelte";
    import { APPLICATION_KEY } from "../storage/applicationContext.svelte.ts";
    import { Download } from "lucide-svelte";
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
        "Themes": DarkLightTheme,
        divider: "divider",
        "Layout": Layout,
    };
    let sections = Object.keys(sectionsMapping);
    let selected = $state(sections[0]);
    let SelectedComponent = $derived(sectionsMapping[selected]);

    // $inspect(selected);

    // console.log(sections);
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
            class="bg-base-100 flex flex-col min-h-0 grow-2 overflow-auto py-6 lg:px-20"
        >
            <div class="h-20 text-xl font-bold pb-10"> {selected} </div>

            <div class="grow">
                <SelectedComponent></SelectedComponent>
            </div>

            <div class="h-20"> </div>

        </div>
    </div>
</dialog>

<!--<div-->
<!--    class="modal-box bg-base-200 flex max-h-11/12 min-h-4/6 w-11/12 max-w-6xl flex-col gap-y-8"-->
<!--&gt;-->
<!--    <div class="flex flex-row gap-2 overflow-hidden h-full">-->

<!--        <div class="bg-base-100 flex w-200 card p-8 shadow-sm flex-col h-full overflow-y-auto">-->
<!--            <div class="p-y-30 grow"> Settings </div>-->
<!--            <div class="p-y-30 grow"> Settings </div>-->
<!--            <div class="p-y-30 grow"> Settings </div>-->
<!--            <div class="p-y-30 grow"> Settings </div>-->
<!--            <div class="p-y-30 grow"> Settings </div>-->
<!--            <div class="p-y-30 grow"> Settings </div>-->
<!--            <div class="p-y-30 grow"> Settings </div>-->
<!--        </div>-->

<!--        <div class="flex grow flex-col">-->

<!--            <div class="flex grow flex-col gap-y-2">-->

<!--                <div class="card bg-base-100 flex flex-col p-8 shadow-sm">-->
<!--                    <ImportExport />-->
<!--                </div>-->
<!--                <div-->
<!--                    class="card bg-base-100 flex grow flex-col p-8 shadow-sm"-->
<!--                >-->
<!--                    <DarkLightTheme />-->
<!--                </div>-->
<!--            </div>-->

<!--            <div class="modal-action">-->
<!--                <form-->
<!--                    class="flex h-full w-full justify-end gap-4"-->
<!--                    method="dialog"-->
<!--                >-->
<!--                    <button-->
<!--                        class="btn btn-ghost text-error hover:bg-error-content"-->
<!--                    >-->
<!--                        Discard-->
<!--                    </button>-->

<!--                    <button autofocus class="btn btn-primary">-->
<!--                        Save-->
<!--                    </button>-->
<!--                </form>-->
<!--            </div>-->

<!--        </div>-->

<!--    </div>-->
<!--</div>-->

<!--<form class="modal-backdrop" method="dialog">-->
<!--    <button>close</button>-->
<!--</form>-->
