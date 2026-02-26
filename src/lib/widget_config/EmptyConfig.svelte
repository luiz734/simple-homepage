<script>
    import WidgetConfig from "../templates/WidgetConfig.svelte";
    import { FileIcon } from "lucide-svelte";

    let { onCancel, onSubmit, onDelete, widgetData } = $props();
</script>

<WidgetConfig {onCancel} {onDelete} {onSubmit} {widgetData}>
    <div
        class="text-base-content flex flex-1 flex-col items-center justify-center"
    >
        <div class="flex flex-row gap-x-2">
            <FileIcon /> This widget has no configuration.
        </div>
    </div>
</WidgetConfig>

<style>
    div {
        color: gray;
    }
</style>
