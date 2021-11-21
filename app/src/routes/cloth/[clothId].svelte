<script>
	import ProgressBar from '$lib/Common/ProgressBar.svelte';
	import { page } from '$app/stores';
	/* Database */
	import { readObject, writeObject } from '$lib/localstorage';
	let db = readObject('db');

	let cloth = db.clothes.filter((el) => el.id === $page.params.clothId)[0];
</script>

<svelte:head>
	<title>Item Info | WearPerformance</title>
</svelte:head>

<div class="clothPage">
	
	<div class="clothListItemImg">
		<img src={cloth.img} alt=""/>
	</div>
	<ProgressBar min="0" max="100" value="50"/>
	<p>Material: {cloth.material}</p>
	<p>Origin: {cloth.origin}</p>
	<p>Number of times Worn: {cloth.nbWorn}</p>

	<div />
</div>

<style>
	.clothPage {
		width: 100%;
		height: 100%;
	}

	.clothListItemImg {
		width: 50%;
		margin: auto;
		padding: 0.3rem;
	}
</style>
