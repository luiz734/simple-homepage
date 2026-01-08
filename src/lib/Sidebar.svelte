<script>
</script>

<div class="sidebar">
    <a class="active" href="#home">Unlock</a>
    <a href="">Foo</a>
    <a href="">Bar</a>
</div>

<style>
    .sidebar {
        margin: 0;
        padding: 0;
        width: 200px;
        background-color: #26282B;
        color: #FEFEFE;
        /*position: fixed;*/
        height: 100%;
        overflow: auto;
    }

    /* Sidebar links */
    .sidebar a {
        display: block;
        /*color: #FEFEFE;*/
        padding: 16px;
        /*text-decoration: none;*/
    }

    /* Active/current link */
    .sidebar a.active {
        background-color: #504C4A;
        color: white;
    }

    /* Links on mouse-over */
    .sidebar a:hover:not(.active) {
        background-color: #393B40;
        color: white;
    }
</style>