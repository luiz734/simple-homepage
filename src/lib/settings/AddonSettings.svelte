<script>
    import {Pencil, Check, Plus, Download} from 'lucide-svelte'; // Added Plus icon
    import {getContext, tick} from 'svelte';
    import {slide} from 'svelte/transition';
    import {APPLICATION_KEY} from "../storage/database.svelte.js";

    let {onCancel, onSubmit} = $props();

    const context = getContext(APPLICATION_KEY);


    const sendForm = (event) => {
        event.preventDefault();

        const payload = {};

        onSubmit(payload);
    }

    const handleFileSelect = (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) {
            console.log('No files uploaded');
            return;
        }

        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = (e) => {
            try {
                const content = e.target.result;
                const jsonSettings = JSON.parse(content);
                context.importState(jsonSettings);
                console.log('Imported Settings:', jsonSettings);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }
        reader.readAsText(file);

        // JSON to object here
        let userSettings = {}
    };

    const handleFileExport = () => {
        console.log($state.snapshot(context))
        const jsonString = JSON.stringify({
                widgets: context.widgets
            }
            , null, 2);
        const blob = new Blob([jsonString], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'settings.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

</script>


<div class="backdrop">
    <div class="dialog">
        <form onsubmit={sendForm} class="form-container">

            <div class="form-row">
                <h1> Settings </h1>
            </div>

            <div class="content-container">
                <div class="vertical-tabs">
                    <button class="settings-button"> foo</button>
                    <button class="settings-button"> bar</button>
                </div>

                <div class="settings-container">

                    <div class="settings-item">
                        <label for="importFile"> Import settings </label>
                        <input
                                type="file"
                                id="importFile"
                                name="filename"
                                accept="application/json"
                                onchange={handleFileSelect}
                        >
                    </div>

                    <div class="settings-item">
                        <label for="exportFile"> Export settings </label>
                        <button id="exportFile" onclick={handleFileExport}>
                            <Download/>
                        </button>
                    </div>

                </div>
            </div>

            <div class="footer-buttons prevent-select">
                <button type="submit">Save</button>
                <button type="button" onclick={onCancel}>Cancel</button>
            </div>
        </form>
    </div>
</div>

<style>
    div {
        /*border: red 1px solid;*/
        /*margin: 8px;*/
        box-sizing: border-box;
    }

    .dialog {
        background-color: #222;
        padding: 20px;
        width: 80%;
        height: 80%;
        max-width: 1000px;

    }

    .form-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }

    .content-container {
        display: flex;
        flex-direction: row;
        flex-grow: 1;
    }

    .vertical-tabs {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 200px;
        background-color: #3D3D41;
        padding: 10px;
        gap: 10px;
    }

    .settings-button {
        height: 32px;
    }

    .settings-container {
        flex-grow: 1;
        padding: 0 10%;
        display: flex;
        flex-direction: column;
    }

    .settings-item {

    }

    .footer-buttons {
        margin-top: 10px;
    }

    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6); /* Slightly darker backdrop */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(2px); /* Optional: adds a modern touch */
    }

</style>