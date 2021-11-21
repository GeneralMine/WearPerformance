<script>
	export let max;
	export let min;
	export let value;
	export let small = false;

	// calculate percentage of the value between min and max
	$: progress = Math.ceil(((value - min) / (max - min)) * 100);
</script>

<div class="progressbar">
	<div class="progressbarInner" class:small style="width: {progress}%;" />
</div>

<style>
	.progressbar {
		background-color: white;
		border: 1px solid black;
		border-radius: 13px;
		/* (height of inner div) / 2 + padding */
		padding: 3px;
	}

	.progressbarInner {
		background-color: green;
		/* Adjust with JavaScript */
		height: 20px;
		border-radius: 10px;
	}

	.small {
		height: 10px;
	}
</style>
