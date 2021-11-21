<script>
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
	HTML goes here...
	<div />
</div>

<style>
	.clothPage {
		width: 100%;
		height: 100%;
	}
</style>
