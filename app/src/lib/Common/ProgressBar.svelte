<script>
	export let max;
	export let min;
	export let value;
	export let small = false;

	// calculate percentage of the value between min and max
	$: progress = Math.ceil(((value - min) / (max - min)) * 100);
</script>

<div class="progress-bar-container">
	<div class:small class="progress-bar-indicator" style="width:{Math.min(max, progress)}%" />
</div>

<style>
	.progress-bar-container {
		position: rel ative; /* relative here */
		border: 1px solid black;
		border-radius: 13px;
		padding: 3px;
	}

	.progress-bar-indicator {
		-webkit-mask: linear-gradient(#fff 0 0);
		mask: linear-gradient(#fff 0 0);
		height: 20px;
		border-radius: 10px;
	}
	.progress-bar-indicator::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: linear-gradient(
			to right,
			lime,
			darkgreen,
			yellow,
			red,
			darkred,
			black
		); /* your gradient here */
	}

	.small {
		height: 10px;
	}
</style>
