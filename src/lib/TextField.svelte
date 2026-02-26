<script>

    let {label} = $props();

</script>


<div class="text-field">
    <label for={label.toLowerCase()}>{label}</label>
    <input name={label.toLowerCase()} required type="text">
</div>

<style>
    label {
        color: #c1c3ca;
        margin-bottom: 4px;
        font-size: 16px;
    }

    input {
        border: 1px solid #aaa;
        border-radius: 4px;
        height: 24px;
        width: 240px;
    }

    .text-field {
        display: flex;
        flex-direction: column;
        margin: 4px;
    }


</style>