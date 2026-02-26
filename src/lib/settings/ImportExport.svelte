<script>
    import { Download } from "lucide-svelte";
    import { getContext } from "svelte";
    import { APPLICATION_KEY } from "../storage/applicationContext.svelte.ts";

    const context = getContext(APPLICATION_KEY);

    const handleFileSelect = (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) {
            console.log("No files uploaded");
            return;
        }

        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = async (e) => {
            try {
                const content = e.target.result;
                await context.importStateFromJsonString(content.toString());
                console.log("Imported Settings:", content);
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

<div class="flex flex-row gap-x-4">
    <fieldset class="fieldset flex-1 grow">
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

    <fieldset class="fieldset flex-1 grow">
        <legend class="fieldset-legend">Export Configuration</legend>
        <button
            class="btn btn-success"
            id="exportFile"
            onclick={handleFileExport}
        >
            <Download />
        </button>
        <label class="label" for="importFile"></label>
    </fieldset>
</div>
