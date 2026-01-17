<script>
    let { onWidgetSelected } = $props();

    const widgets = ["clock", "shortcuts", "calculator",];

    // Internal sorting only (does not affect props)
    let sortedWidgets = $derived([...widgets].sort());
</script>

<div class="backdrop">
    <div class="ring-dialog">
        <h2 class="dialog-title">Select Widget</h2>

        <div class="widget-grid">
            {#each sortedWidgets as widget}
                <button class="widget-card" onclick={() => onWidgetSelected(widget)}>
                    <div class="widget-icon-placeholder">
                        {widget[0].toUpperCase()}
                    </div>
                    <span class="widget-name">{widget}</span>
                </button>
            {/each}
        </div>
    </div>
</div>

<style>
    .ring-dialog {
        --ring-dark-bg: #23272b;
        --ring-content-bg: #191919;
        --ring-border: #474747;
        --ring-text: #dfdfdf;
        --ring-text-secondary: #808080;
        --ring-primary: #358cf6;
        --ring-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);

        background-color: var(--ring-dark-bg);
        color: var(--ring-text);
        box-shadow: var(--ring-shadow);
        border-radius: 4px;
        border: 1px solid #111;

        padding: 24px;
        width: 600px;
        max-width: 90%;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
    }

    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(2px);
    }

    .dialog-title {
        margin: 0 0 20px 0;
        font-size: 18px;
        font-weight: 700;
        border-bottom: 1px solid var(--ring-border);
        padding-bottom: 12px;
    }

    /* Grid Layout */
    .widget-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 12px;
        overflow-y: auto;
        padding: 4px;
    }

    /* Card Styling */
    .widget-card {
        background-color: var(--ring-content-bg);
        border: 1px solid var(--ring-border);
        border-radius: 4px;
        padding: 16px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        height: 100px;
        color: var(--ring-text);
        transition: all 0.2s ease-in-out;
    }

    .widget-card:hover {
        border-color: var(--ring-primary);
        background-color: #2a2e33;
        transform: translateY(-1px);
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    .widget-name {
        font-size: 13px;
        font-weight: 500;
        text-transform: capitalize;
    }

    .widget-icon-placeholder {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #2d3136;
        color: var(--ring-text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }

    .widget-card:hover .widget-icon-placeholder {
        color: var(--ring-primary);
        background-color: rgba(53, 140, 246, 0.1);
    }

    /* Scrollbar */
    .widget-grid::-webkit-scrollbar { width: 8px; }
    .widget-grid::-webkit-scrollbar-track { background: transparent; }
    .widget-grid::-webkit-scrollbar-thumb { background-color: var(--ring-border); border-radius: 4px; }
    .widget-grid::-webkit-scrollbar-thumb:hover { background-color: var(--ring-text-secondary); }
</style>