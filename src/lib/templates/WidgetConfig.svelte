<script>
    let {onCancel, onSubmit, onDelete, widgetData, children} = $props();

    const sendForm = (event) => {
        event.preventDefault();

        const payload = {
            ...widgetData,
        };

        onSubmit(payload);
    }
</script>

<div class="ring-dialog">
    <form onsubmit={sendForm} class="form-container">

        <div class="prop-content">
            {@render children()}
        </div>

        <div class="footer-buttons prevent-select">
            <button type="submit" class="ring-btn ring-btn-primary">Save</button>
            <button type="button" class="ring-btn" onclick={onCancel}>Cancel</button>
            <div style="flex-grow: 1"></div>
            <button type="button" class="ring-btn ring-btn-destroy" onclick={onDelete}> Delete Widget</button>
        </div>
    </form>
</div>

<style>
    :global(body) {
        background-color: #191919;
        color: #dfdfdf;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .ring-dialog {
        --ring-dark-bg: #23272b;
        --ring-border: #474747;
        --ring-input-bg: #191919;
        --ring-text: #dfdfdf;
        --ring-text-secondary: #808080;
        --ring-primary: #358cf6;
        --ring-primary-hover: #307ecc;
        --ring-error: #c22731;

        background-color: var(--ring-dark-bg);
        color: var(--ring-text);
        padding: 24px;
        border-radius: 4px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);

        width: 600px;
        margin: 20px auto;
    }

    .prop-content {
        /*border: 1px solid red;*/
    }

    .footer-buttons {
        display: flex;
        gap: 12px;
        margin-top: 24px;
    }

    .ring-btn {
        background-color: transparent;
        border: 1px solid var(--ring-border);
        color: var(--ring-text);
        padding: 0 16px;
        height: 32px;
        line-height: 30px;
        font-size: 14px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .ring-btn:hover {
        border-color: #707070;
    }

    .ring-btn-primary {
        background-color: var(--ring-primary);
        border-color: var(--ring-primary);
        color: #fff;
        font-weight: 500;
    }

    .ring-btn-primary:hover {
        background-color: var(--ring-primary-hover);
        border-color: var(--ring-primary-hover);
    }

    .ring-btn-destroy {
        background-color: var(--ring-destroy);
        border-color: var(--ring-destroy);
        color: #fff;
        font-weight: 500;
    }

    .ring-btn-destroy:hover {
        background-color: var(--ring-destroy-hover);
        border-color: var(--ring-destroy-hover);
    }

    .grid-container .ring-btn-icon:hover {
        color: var(--ring-error);
        background-color: rgba(194, 39, 49, 0.1);
    }
</style>