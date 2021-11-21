<script>
	import ClothList from '$lib/Cloth/ClothList.svelte';
	import ClothListItem from '$lib/Cloth/ClothListItem.svelte';
	import Button from '$lib/Common/Button.svelte';
	import { writeObject, readObject } from '$lib/localstorage';

	let db = readObject('db');

	let openAddMenuOpen = false;
	function openAddMenu() {
		openAddMenuOpen = !openAddMenuOpen;
	}
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
			{#if openAddMenuOpen}
				<div class="openAddMenu">
					<div class="buttonLeft">
						<Button url="/add?type=hose" round={true}
							><img src="/icons/hose.png" alt="Add" class="plus smaller" /></Button
						>
					</div>
					<div class="buttonMiddle">
						<Button url="/add?type=tshirt" round={true}
							><img src="/icons/tshirt.png" alt="Add" class="plus smaller" /></Button
						>
					</div>
					<div class="buttonRight">
						<Button url="/add?type=pulli" round={true}
							><img src="/icons/pulli.png" alt="Add" class="plus smaller" /></Button
						>
					</div>
				</div>
			{/if}
			<Button on:click={openAddMenu} round={true}
				><img src="/icons/plus.png" alt="Add" class="plus" /></Button
			>
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
	.plus {
		z-index: 5;
		width: 3rem;
		height: 3rem;
	}
	.buttonLeft {
		position: relative;
		left: -2.5rem;
		top: -2.5rem;
	}
	.buttonMiddle {
		position: relative;
		top: -5rem;
	}
	.buttonRight {
		position: relative;
		left: 2.5rem;
		top: -2.5rem;
	}
	.openAddMenu {
		z-index: 1;
		position: fixed;
		bottom: 2%;
		width: 90%;
		height: 3rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.smaller {
		width: 2rem;
		height: 2rem;
	}
</style>
