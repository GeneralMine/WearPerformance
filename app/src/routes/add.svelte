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
	import { page } from '$app/stores';
	const selectedType = $page.query.get('type');

	let videoEl;
	let canvasEl;
	let loading = true;
	let captured = false;
	let error;
	let persons = [];
	let disabled = false;

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

		disabled = true;

		// Get the image data and upload it to Imgur
		const data = canvasEl.toDataURL();
		const imageResponse = await uploadImageToImgur(data);
		if (imageResponse.status !== 200) {
			console.log('Unable to upload to Imgur', imageResponse);
			error = imageResponse.data.error;
			return;
		}

		// Let azure find people in the imgur image
		const imgURL = imageResponse.data.link;
		const personResponse = await getPersonFromAzure(imgURL);

		// Find all persons in the object detection
		persons = personResponse.objects
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
			ctx.strokeStyle = 'green';
			ctx.rect(
				person.rectangle.x - 3,
				person.rectangle.y - 3,
				person.rectangle.w + 6,
				person.rectangle.h + 6
			);
			ctx.stroke();

			ctx.beginPath();
			ctx.lineWidth = '3';
			ctx.strokeStyle = 'red';
			let x, y, w, h;
			if (selectedType === 't-shirt' || selectedType === 'pulli') {
				x = person.rectangle.x;
				y = person.rectangle.y + person.rectangle.h * 0.1;
				w = person.rectangle.w;
				h = person.rectangle.h * 0.5;
			} else if (selectedType === 'hose') {
				x = person.rectangle.x;
				y = person.rectangle.y + person.rectangle.h * 0.5;
				w = person.rectangle.w;
				h = person.rectangle.h * 0.5;
			}
			ctx.rect(x - 3, y - 3, w + 6, h + 6);
			ctx.stroke();
		}

		disabled = false;
	}

	async function accept() {
		// Calculate bounding box for cloth
		let person = persons[0];
		let x, y, w, h;
		if (selectedType === 't-shirt' || selectedType === 'pulli') {
			x = person.rectangle.x;
			y = person.rectangle.y + person.rectangle.h * 0.1;
			w = person.rectangle.w;
			h = person.rectangle.h * 0.5;
		} else if (selectedType === 'hose') {
			x = person.rectangle.x;
			y = person.rectangle.y + person.rectangle.h * 0.5;
			w = person.rectangle.w;
			h = person.rectangle.h * 0.5;
		}

		// Crop the image
		canvasEl
			.getContext('2d')
			.drawImage(canvasEl, x, y, w, h, 0, 0, canvasEl.width, canvasEl.height);

		// Get the image data and upload it to Imgur
		const data = canvasEl.toDataURL();
		const imageResponse = await uploadImageToImgur(data);
		if (imageResponse.status !== 200) {
			console.log('Unable to upload to Imgur', imageResponse);
			error = imageResponse.data.error;
			return;
		}

		db.clothes.push({
			id: db.clothes.slice(-1).id + 1 || 0,
			name: 'Test',
			type: 'test',
			color: 'asd',
			img: imageResponse.data.link
		});
		writeObject('db', db);
		goto('/wardrobe');
	}

	function deny() {
		captured = !captured;
	}
</script>

<svelte:head>
	<title>Add new Item | WearPerformance</title>
</svelte:head>

<div class="addPage">
	<div class="headerBar">Add new Item</div>

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
				<Button {disabled} on:click={accept}>Accept</Button>
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
