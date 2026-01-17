<script>
    import WidgetConfig from "../templates/WidgetConfig.svelte";

    let {onCancel, onSubmit, onDelete, widgetData} = $props();


</script>

<WidgetConfig
        {onCancel}
        {onDelete}
        {onSubmit}
        {widgetData}
>
    <div> This widget has no configuration. </div>

</WidgetConfig>


<style>
    div {
        color: gray;
    }
</style>