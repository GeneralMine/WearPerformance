<script>
    export let cloth = {
        "id": "",
        "name": "",
        "image": "",
        "category": "",
        "color": "",

    };
</script>

<div class="clothTileContainer">
    <p>{cloth.name}</p>
    <img src={`/cloths/${cloth.category}-${cloth.color}`} alt={cloth.name}>
</div>

<style>
    .clothTileContainer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        margin: 1em;
        padding: 0;
        border: 1px solid grey;
    }
</style>