<script>
	import Button from '$lib/Common/Button.svelte';
	import ProgressBar from '$lib/Common/ProgressBar.svelte';
</script>

<svelte:head>
	<title>WearPerformance</title>
</svelte:head>

<div class="indexPage">
	<div>
		<br>
		<div class="format">Your clothing choices</div>
	</div>

	<img src="/logo.png" alt="">

	<div class="globalStats">
		<h3>Overall footprint performance</h3>
		<ProgressBar min="0" max="100" value="43" />
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

	.format {
		font-weight: bold;
		font-size: 2rem;
	}

	img{
		width: 100%;
		height: auto;
	}
</style>
