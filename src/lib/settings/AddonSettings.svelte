<script>
    import { getContext } from "svelte";
    import { APPLICATION_KEY } from "../storage/database.svelte.js";
    import { Download } from "lucide-svelte";

    let { onCancel, onSubmit } = $props();
    let dialog = $state();

    export function show() {
        dialog.showModal();
    }

    const context = getContext(APPLICATION_KEY);

    const sendForm = (event) => {
        event.preventDefault();
        const payload = {};
        onSubmit(payload);
    };

    const handleFileSelect = (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) {
            console.log("No files uploaded");
            return;
        }

        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = (e) => {
            try {
                const content = e.target.result;
                const jsonSettings = JSON.parse(content.toString());
                context.importState(jsonSettings);
                console.log("Imported Settings:", jsonSettings);
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        };
        reader.readAsText(file);
    };

    const handleFileExport = () => {
        const blob = context.exportJsonBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "settings.json";
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
</script>

<dialog bind:this={dialog} class="modal">
    <div
        class="modal-box bg-base-200 flex min-h-4/6 w-11/12 max-w-6xl max-h-11/12 flex-col gap-y-8"
    >
        <div class="flex grow flex-col gap-y-8">

            <div class="flex flex-col p-8 card bg-base-100 shadow-sm">
                <div class="flex">
                    <fieldset class="fieldset grow">
                        <legend class="fieldset-legend">Import Configuration</legend>
                        <input
                            accept="application/json"
                            class="file-input"
                            id="importFile"
                            name="filename"
                            onchange={handleFileSelect}
                            type="file"
                        />
                        <label class="label" for="importFile"></label>
                    </fieldset>

                    <fieldset class="fieldset grow">
                        <legend class="fieldset-legend">Export Configuration</legend>
                        <button class="btn btn-success" id="exportFile" onclick={handleFileExport}>
                            <Download/>
                        </button>
                        <label class="label" for="importFile"></label>
                    </fieldset>
                </div>
            </div>
        </div>

        <div class="modal-action">
            <form class="flex h-full w-full justify-end gap-4" method="dialog">
                <button class="btn btn-ghost text-error hover:bg-error-content">
                    Discard
                </button>

                <button class="btn btn-primary" autofocus> Save </button>
            </form>
        </div>
    </div>

    <form class="modal-backdrop" method="dialog">
        <button>close</button>
    </form>
</dialog>
