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
			
			<!--
			<div class="buttons">
				<div id="first">Home</div>
				<div id="bar">|</div>
				<div id="second" on:click={openAddMenu}>Add Item</div>
				<img src="/icons/plus.png" alt="Add" class="plus" />
			</div>
			</div>-->
			<div class="center">
			<Button on:click={openAddMenu} round={true}
				><img src="/icons/plus.png" alt="Add" class="plus" /></Button
			>
			</div>
			<div class="buttons">
				<Button url="/">Home</Button>
			</div>
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
		font-weight: 700;
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
		bottom: 8%;
		width: 90%;
		height: 3rem;
		/*display: flex;*/
		justify-content: center;
		align-items: center;
	}
	.plus {
		z-index: 5;
		width: 3rem;
		height: 3rem;
		text-align: center;
		margin: auto;
	}
	.buttonLeft {
		position: relative;
		left: -2.5rem;
		top: -7.5rem;
	}
	.buttonMiddle {
		position: relative;
		top: -10rem;
	}
	.buttonRight {
		position: relative;
		left: 2.5rem;
		top: -7.5rem;
	}

	.center{
		color: white;
    	width: 10%;
		height: 100%;
		margin:auto;
		text-align: center;
		padding-bottom: 2%;
	}

	.buttons {
		
		background-color: var(--primary-color);
		color: white;
    	width: 50%;
		height: 100%;
		margin: auto;
		text-align: center;
		border-radius: 20px;
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

	#first {
		float:left;
	    width: 100%;
		height: 100%;
		top: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#second {
		float:left;
		width: 49%;
		margin: auto;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#bar {
		float:left;
		width: 2%;
		margin: auto;
		height: 100%;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: center;
	}

</style>
