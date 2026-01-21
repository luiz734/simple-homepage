<script>
    import WidgetConfig from "../templates/WidgetConfig.svelte";
    import { FileIcon } from "lucide-svelte";

    let { onCancel, onSubmit, onDelete, widgetData } = $props();
</script>

<WidgetConfig {onCancel} {onDelete} {onSubmit} {widgetData}>
    <div class="text-base-content justify-center flex-1 flex flex-col items-center">
        <div class="flex flex-row gap-x-2"> <FileIcon/> This widget has no configuration. </div>
    </div>
</WidgetConfig>

<style>
    div {
        color: gray;
    }
</style>
