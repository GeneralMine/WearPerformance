<script>
import ClothTile from "$lib/Cloth/ClothTile.svelte";

    let cloths = [];

    let type = "";
    let color = "";

    function addToList() {
        let newCloth = {
            type,
            color
        }
        cloths = [...cloths, newCloth];
    }
</script>

<h1>Welche to WearPerformance</h1>

<h2>Your cloths</h2>

{#each cloths as cloth}
    <ClothTile {cloth} ></ClothTile>
{/each}

<h2>Add your cloth</h2>

<h3>Farbe</h3>
<select bind:value={color}>
    <option value="red">Red</option>
    <option value="blue">Blue</option>
    <option value="green">Green</option>
</select>

<h3>Typ</h3>
<select bind:value={type}>
    <option value="t-shirt">T-Shirt</option>
    <option value="pulli">Pulli</option>
    <option value="hose">Hose</option>
</select>

<button on:click={() => addToList()}>Hinzufügen</button>

<style>
    p {
        font-size: 1.5rem;
        color: red;
    }

    .cloth {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 1rem;
    }
</style>