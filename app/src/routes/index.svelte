<script>
	import Button from '$lib/Common/Button.svelte';
	import ProgressBar from '$lib/Common/ProgressBar.svelte';
</script>

<svelte:head>
	<title>WearPerformance</title>
</svelte:head>

<div class="indexPage">
	<div>
		<h1>Your clothing choices</h1>
	</div>

	<div class="globalStats">
		<h3>Overall footprint performance</h3>
		<ProgressBar min="0" max="100" value="50" />
		<p>Stat1: Leider Geil</p>
		<p>Stat2: Zum Glück scheiße</p>
	</div>

	<div class="buttons">
		<Button url="/wardrobe">Your Wardrobe</Button>
		<Button url="/log">Log my day</Button>
	</div>
</div>

<style>
	.indexPage {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
		justify-content: space-between;
	}
	.buttons {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}
</style>
