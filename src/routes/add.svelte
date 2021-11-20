<script>
	import Button from '$lib/Common/Button.svelte';

	/* Database */
	import { readObject, writeObject } from '$lib/localstorage';

	let db = readObject('db');

	function add() {
		db.clothes.push({
			id: db.clothes.slice(-1).id + 1,
			name: 'Test',
			type: 'test',
			color: 'asd',
			img: 'asd'
		});
		writeObject('db', db);
		goto('/wardrobe');
	}

	/* Camera */
	import { onMount } from 'svelte';

	let videoEl;
	let canvasEl;
	let loading = true;
	let captured = false;
	let error;

	onMount(async () => {
		try {
			loading = true;
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true
			});
			videoEl.srcObject = stream;
			videoEl.play();
			loading = false;
		} catch (err) {
			error = err;
			console.log(error);
		}
	});

	function capture() {
		captured = !captured;
		canvasEl.width = videoEl.videoWidth;
		canvasEl.height = videoEl.videoHeight;
		canvasEl.getContext('2d').drawImage(videoEl, 0, 0);
	}

	function accept() {
		const data = canvasEl.toDataURL('image/png');
		console.log(data);
	}

	function deny() {
		captured = !captured;
	}
</script>

<div class="addPage">
	<div class="headerBar">Add new clothing</div>

	<div class="camera">
		<!-- svelte-ignore a11y-media-has-caption -->
		<video class:hidden={captured} bind:this={videoEl} />
		<canvas class:hidden={!captured} bind:this={canvasEl} />
	</div>

	<div class="buttonRow">
		{#if captured}
			<Button on:click={accept}>Accept</Button>
			<Button on:click={deny}>Deny</Button>
		{:else}
			<Button on:click={capture}>Capture</Button>
		{/if}
	</div>

	{#if loading}
		loading...
	{/if}
	{#if error}
		<code>{JSON.stringify(error, null, 4)}</code>
	{/if}
</div>

<style>
	.addPage {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}
	.headerBar {
		font-size: 1.5em;
		font-weight: bold;
		text-align: center;
		border-bottom: 1px solid #ccc;
		margin-bottom: 0.5rem;
	}
	.camera {
		flex: 1;
	}
	video {
		display: flex;
		top: 0%;
		width: 100%;
		height: auto;
	}
	canvas {
		display: flex;
		top: 0%;
		width: 100%;
		height: auto;
	}
	.hidden {
		display: none;
	}
	.buttonRow {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-top: 1rem;
	}
</style>
