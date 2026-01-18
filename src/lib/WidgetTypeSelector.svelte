<script>
  let { onWidgetSelected } = $props();

  const widgets = ["clock", "shortcuts", "calculator"];

  // Internal sorting only (does not affect props)
  let sortedWidgets = $derived([...widgets].sort());
</script>

<div class="fixed inset-0 flex items-center justify-center backdrop-blur">
  <div class="">
    <h2 class="">Select Widget</h2>

    <div class="">
      {#each sortedWidgets as widget}
        <button class="" onclick={() => onWidgetSelected(widget)}>
          {widget[0].toUpperCase()}
          <span class="">{widget}</span>
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
</style>
