<script context="module">
	export const ssr = false;
</script>

<script>
	import ProgressBar from '$lib/Common/ProgressBar.svelte';
	import { navigating, page } from '$app/stores';
	import Button from '$lib/Common/Button.svelte';
	/* Database */
	import { readObject, writeObject } from '$lib/localstorage';
	let db = readObject('db');
	import { goto } from '$app/navigation';
	import { origins, materials } from '$lib/sustainability';
	let cloth = db.clothes[$page.params.clothId];
	//$: cloth = db ? db.clothes.filter((el) => el.id === $page.params.clothId) : null;
	function remove() {
		db.clothes = db.clothes.filter((el) => el.id !== cloth.id);
		writeObject('db', db);
		console.log(db);
		goto('/wardrobe');
	}
</script>

<svelte:head>
	<title>Item Info | WearPerformance</title>
</svelte:head>

{#if db && cloth}
	<div class="clothPage">
		<div class="clothListItemImg">
			<img src={cloth.img} alt="" />
			<h1>{cloth.name}</h1>
			<div id="wrapper">
				<div id="first">Number of times Worn: {cloth.wornCounter}</div>
				<div id="second">Added: {cloth.dateAdded}</div>
			</div>
		</div>
		<div class="stats">
			<h3>Your item footprint</h3>
			<ProgressBar min="0" max="100" value="50" />
			<br />
			<p>Material: {cloth.material}</p>
			<ProgressBar min="0" max="10" value={materials[cloth.material]} />
			<br />
			<p>Origin: {cloth.origin}</p>
			<ProgressBar min="0" max="100" value={origins[cloth.origin] / 100} />
		</div>
		<br />
		<div class="buttons">
			<Button on:click={remove} color="red">Delete</Button>
			<Button color="grey" url="/wardrobe">Back</Button>
		</div>
	</div>
{/if}

<style>
	.clothPage {
		width: 50%;
		height: 100%;
		text-align: center;
		margin: auto;
	}

	.clothListItemImg {
		display: block;
		margin: auto;
		padding: 0.3rem;
		text-align: center;
	}

	img {
		width: 100%;
		height: auto;
		border-radius: 20px;
	}

	.stats {
		display: block;
		margin: auto;
		padding: 0.3rem;
		text-align: center;
	}

	.buttons {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	#wrapper {
		overflow: hidden;
		width: 100%;
	}
	#first {
		float: left;
		width: 50%;
	}
	#second {
		float: left;
		width: 50%;
	}
</style>
