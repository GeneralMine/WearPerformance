<script>
	import Button from '$lib/Common/Button.svelte';

	/* Database */
	import { readObject, writeObject } from '$lib/localstorage';
	let db = readObject('db');

	/* Camera */
	import { onMount } from 'svelte';
	/* Imgur */
	import { uploadImageToImgur } from '$lib/imgur';
	import { getPersonFromAzure } from '$lib/azure';
	import { goto } from '$app/navigation';

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

	async function capture() {
		captured = !captured;
		canvasEl.width = videoEl.videoWidth;
		canvasEl.height = videoEl.videoHeight;
		canvasEl.getContext('2d').drawImage(videoEl, 0, 0);

		// Get the image data and upload it to Imgur
		const data = canvasEl.toDataURL();
		const imageResponse = await uploadImageToImgur(data);
		console.log(imageResponse);
		if (imageResponse.status !== 200) {
			console.log('Unable to upload to Imgur', imageResponse);
			error = imageResponse.data.error;
			return;
		}

		// Let azure find people in the imgur image
		const imgURL = imageResponse.data.link;
		const personResponse = await getPersonFromAzure(imgURL);
		console.log(personResponse);

		// Find all persons in the object detection
		let persons = personResponse.objects
			.filter((person) => person.confidence > 0.5 && person.object === 'person')
			.sort((a, b) => b.confidence - a.confidence);
		console.log('Got persons:', persons);
		if (persons.length === 0) {
			console.log('No person detected');
			error = 'No person detected';
			return;
		}

		// Draw bounding boxes
		var ctx = canvasEl.getContext('2d');
		for (let person of persons) {
			ctx.beginPath();
			ctx.lineWidth = '3';
			ctx.strokeStyle = 'red';
			ctx.rect(person.rectangle.x, person.rectangle.y, person.rectangle.w, person.rectangle.h);
			ctx.stroke();
		}
	}

	async function accept() {
		db.clothes.push({
			id: db.clothes.slice(-1).id + 1,
			name: 'Test',
			type: 'test',
			color: 'asd',
			img: res.data.link
		});
		writeObject('db', db);
		goto('/wardrobe');
	}

	function deny() {
		captured = !captured;
	}
</script>

<div class="addPage">
	<div class="headerBar">Add new clothing</div>

	<div class="camera">
		{#if loading}
			loading...
		{/if}
		<!-- svelte-ignore a11y-media-has-caption -->
		<video class:hidden={captured} bind:this={videoEl} />
		<canvas class:hidden={!captured} bind:this={canvasEl} />
	</div>

	<div class="footer">
		{#if error}
			<span class="error">{JSON.stringify(error, null, 4)}</span>
		{/if}
		<div class="buttonRow">
			{#if captured}
				<Button on:click={accept}>Accept</Button>
				<Button on:click={deny}>Deny</Button>
			{:else}
				<Button on:click={capture}>Capture</Button>
			{/if}
		</div>
	</div>
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
	.footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 1rem;
	}
	.buttonRow {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.error {
		color: red;
		font-weight: bold;
		text-align: center;
	}
</style>
