<script>
    import Widgets from "./lib/Widgets.svelte";
    import Sidebar from "./lib/Sidebar.svelte";
</script>

<div class="app">

    <Sidebar/>
    <Widgets/>

</div>

<style>
    html {
        box-sizing: border-box;
    }
    .app {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100vh;

    }

</style>