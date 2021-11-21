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
	import { destroy_block } from 'svelte/internal';
	let cloth = db.clothes[$page.params.clothId];
	//$: cloth = db ? db.clothes.filter((el) => el.id === $page.params.clothId) : null;
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
				<div id="second">Added: {cloth.daysAdded} days ago</div>
			</div>
		</div>
		<div class="stats">
			<h3>Your item footprint</h3>
			<ProgressBar min="0" max="100" value="50" />
			<br />
			<p>Material: {cloth.material}</p>
			<ProgressBar min="0" max="100" value="50" />
			<br />
			<p>Origin: {cloth.origin}</p>
			<ProgressBar min="0" max="100" value="50" />
		</div>
		<br />
		<div class="buttons">
			//TODO Delete Item functionality
			<Button color="red" url="/">Delete</Button>
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
