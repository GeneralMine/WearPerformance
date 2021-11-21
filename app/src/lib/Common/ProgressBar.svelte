<script>
	import { readObject, writeObject } from '$lib/localstorage';
	let db = readObject('db');

	export let max;
	export let min;
	export let value;
	export let small = false;

	// Access all clothes using "db.clothes"

	// calculate percentage of the value between min and max
	$: progress = Math.ceil(((value - min) / (max - min)) * 100);
</script>

<div class="progressbar">
	<div class="goalValue"/>
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

	/*
	.goalValue {
		border-radius:11px solid black;
		border-bottom-left-radius: 13px;
		border-top-left-radius: 13px;
		padding: 10px;
		position: absolute;
		width: 20 px;
	}
	*/

	.small {
		height: 10px;
	}
</style>
