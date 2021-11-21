<script context="module">
	export const ssr = false;
</script>

<script>
	/* Database */
	import { readObject, writeObject } from '$lib/localstorage';
	let db = readObject('db');

	/* Camera */
	import { onMount } from 'svelte';
	/* Imgur */
	import { uploadImageToImgur } from '$lib/imgur';
	import { getPersonFromAzure } from '$lib/azure';
	import { goto } from '$app/navigation';
	import ClothListItem from '$lib/Cloth/ClothListItem.svelte';

	let videoEl;
	let canvasEl;
	let canvasEl2;
	let loading = true;
	let captured = false;
	let error;
	let persons = [];
	let disabled = false;
	let accepted = false;

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
		canvasEl2.getContext('2d').drawImage(canvasEl, 0, 0);

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

			// Draw tshirt/pulli
			ctx.beginPath();
			ctx.lineWidth = '3';
			ctx.strokeStyle = 'red';
			let x, y, w, h;
			x = person.rectangle.x;
			y = person.rectangle.y + person.rectangle.h * 0.1;
			w = person.rectangle.w;
			h = person.rectangle.h * 0.5;
			ctx.rect(x - 3, y - 3, w + 6, h + 6);
			ctx.stroke();

			// Draw hose
			ctx.beginPath();
			ctx.lineWidth = '3';
			ctx.strokeStyle = 'yellow';
			x = person.rectangle.x;
			y = person.rectangle.y + person.rectangle.h * 0.5;
			w = person.rectangle.w;
			h = person.rectangle.h * 0.5;
			ctx.rect(x - 3, y - 3, w + 6, h + 6);
			ctx.stroke();
		}

		disabled = false;
	}

	async function accept() {
		// Calculate bounding box for cloth
		let person = persons[0];
		let images = [];
		let x, y, w, h;
		x = person.rectangle.x;
		y = person.rectangle.y + person.rectangle.h * 0.1;
		w = person.rectangle.w;
		h = person.rectangle.h * 0.5;

		// Crop the image
		canvasEl
			.getContext('2d')
			.drawImage(canvasEl, x, y, w, h, 0, 0, canvasEl.width, canvasEl.height);

		// Get the image data and upload it to Imgur
		let data = canvasEl.toDataURL();
		let imageResponse = await uploadImageToImgur(data);
		if (imageResponse.status !== 200) {
			console.log('Unable to upload to Imgur', imageResponse);
			error = imageResponse.data.error;
			return;
		}
		images.push(imageResponse.data.link);

		x = person.rectangle.x;
		y = person.rectangle.y + person.rectangle.h * 0.5;
		w = person.rectangle.w;
		h = person.rectangle.h * 0.5;

		// Crop the image
		canvasEl
			.getContext('2d')
			.drawImage(canvasEl2, x, y, w, h, 0, 0, canvasEl.width, canvasEl.height);

		// Get the image data and upload it to Imgur
		data = canvasEl.toDataURL();
		imageResponse = await uploadImageToImgur(data);
		if (imageResponse.status !== 200) {
			console.log('Unable to upload to Imgur', imageResponse);
			error = imageResponse.data.error;
			return;
		}
		images.push(imageResponse.data.link);

		accepted = true;
	}

	function deny() {
		captured = !captured;
		accepted = false;
	}

	function finish() {
		db.clothes.push({
			id: db.clothes.slice(-1).id + 1 || 0,
			name,
			type,
			color,
			material,
			origin,
			score: 0,
			wornCounter: 0,
			img
		});
		writeObject('db', db);
		goto('/wardrobe');
	}

	$: firstCloth = db.clothes[0];
	$: secondCloth = db.clothes[1];

	function findBestFit() {
		firstCloth = db.clothes[0];
		secondCloth = db.clothes[1];
	}
</script>

<svelte:head>
	<title>Log Outfit | WearPerformance</title>
</svelte:head>

{#if db && db.clothes && db.clothes.length > 0}
	<!-- content here -->
	<div class="logPage">
		<div class="headerBar">Add new Item</div>

		<div class="inputs" class:hidden={!accepted}>
			<h3>2 items recognized!</h3>
			<p>Logging the following</p>
			{#if db.clothes.length === 1}
				<ClothListItem log={true} bind:cloth={firstCloth} />
			{/if}
			{#if db.clothes.length === 2}
				<ClothListItem log={true} bind:cloth={secondCloth} />
			{/if}
		</div>
		<div class="camera" class:hidden={accepted}>
			{#if loading}
				loading...
			{/if}
			<!-- svelte-ignore a11y-media-has-caption -->
			<video class:hidden={captured} bind:this={videoEl} />
			<canvas class:hidden={!captured} bind:this={canvasEl} />
			<canvas class:hidden={true} bind:this={canvasEl2} />
		</div>

		<div class="footer">
			{#if error}
				<span class="error">{JSON.stringify(error, null, 4)}</span>
			{/if}
			<div class="buttonRow">
				{#if captured && !accepted}
					<img on:click={accept} src="/icons/tick{disabled ? '_disabled' : ''}.png" alt="accept" />
					<img on:click={deny} src="/icons/cross.png" alt="deny" />
				{:else if accepted}
					<img on:click={finish} src="/icons/tick{disabled ? '_disabled' : ''}.png" alt="accept" />
					<img on:click={deny} src="/icons/cross.png" alt="deny" />
				{:else}
					<img on:click={capture} src="/icons/cambutton.png" alt="Cam" />
				{/if}
			</div>
		</div>
	</div>
{:else}
	Add items to your wardrobe to log them here!
{/if}

<style>
	.inputs {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
	}
	.acceptedImage {
		width: 100%;
		height: auto;
	}
	.logPage {
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
	img {
		width: 4rem;
		height: 4rem;
		padding-left: 4rem;
		padding-right: 4rem;
	}
</style>
