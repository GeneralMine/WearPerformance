<script>
	import ClothList from '$lib/Cloth/ClothList.svelte';
	import ClothListItem from '$lib/Cloth/ClothListItem.svelte';
	import Button from '$lib/Common/Button.svelte';
	import { writeObject, readObject } from '$lib/localstorage';

	let db = readObject('db');
</script>

<svelte:head>
	<title>Your Wardrobe | WearPerformance</title>
</svelte:head>

{#if db}
	<div class="wardrobePage">
		<div class="headerBar">Your Wardrobe</div>

		<div class="listBar">
			<div class="search">{db.clothes.length} Articles</div>
			<!-- TODO: Add filter icon, implement filtering -->
			<div class="filterButton" />
		</div>

		<ClothList>
			{#each db.clothes as cloth}
				<ClothListItem {cloth} />
			{:else}
				<p>No clothes yet</p>
			{/each}
			<div class="spacer" />
		</ClothList>

		<div class="footerBar">
			<Button url="/add" round={true}>+</Button>
		</div>
	</div>
{/if}

<style>
	.wardrobePage {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.headerBar {
		font-size: 1.5em;
		font-weight: bold;
		text-align: center;
		border-bottom: 1px solid #ccc;
		margin-bottom: 0.5rem;
	}
	.listBar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5em;
	}
	.spacer {
		height: 5rem;
	}
	.footerBar {
		position: fixed;
		bottom: 2%;
		width: 90%;
		height: 3rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
