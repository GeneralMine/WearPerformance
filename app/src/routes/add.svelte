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
	import { page } from '$app/stores';
	const selectedType = $page.query.get('type');

	let videoEl;
	let canvasEl;
	let ms = 0; // Material Score -> Lookuptable
	let gw = 0; // Gewicht Score -> Lookuptable
	let ts = 0; // Transport Score -> from how far away the product comes from
	let goalNumber = 0; // Number of times an article has to be worn to be eco friendly
	let loading = true;
	let captured = false;
	let error;
	let persons = [];
	let disabled = false;
	let name = '',
		color = '',
		material = '',
		origin = '',
		img = '';
	let accepted = false;
	let dateAdded = '';
	let type = selectedType;

	var today = new Date();
	dateAdded = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

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
			if (selectedType === 'tshirt' || selectedType === 'pulli') {
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
		if (selectedType === 'tshirt' || selectedType === 'pulli') {
			// Lookup table part (temporary if statement construct)
			if (selectedType === 'tshirt') {
				gw = 2;
			} else {
				gw = 5;
			}
			x = person.rectangle.x;
			y = person.rectangle.y + person.rectangle.h * 0.1;
			w = person.rectangle.w;
			h = person.rectangle.h * 0.5;
		} else if (selectedType === 'hose') {
			gw = 4;
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
		img = imageResponse.data.link;

		accepted = true;
	}

	function deny() {
		captured = !captured;
		accepted = false;
	}

	function finish() {
		if (name === '' || material === '' || origin === '' || img === '') {
			alert('Please fill in all the fields');
			return;
		}
		/*
		const lookupCSV = require('lookup-csv');
 
		// Create a lookup table using lookup column name to use from the csv data
		const lookupTable = lookupCSV('../static/distanceToCountry.csv', 'Distance');
 
		// Get rows matching lookup value
		ts = lookupTable.get(origin) * 0.0005;
		*/
		switch (material) {
			case 'Kunstoff':
				(ms = 5), 5;
				break;
			case 'Pelz':
				ms = 7;
				break;
			case 'Leder':
				ms = 7;
				break;
			case 'Baumwolle':
				(ms = 4), 5;
				break;
			case 'Bio-Baumwolle':
				ms = 1;
				break;
		}

		goalNumber = (ms * gw + ts) * 3;

		db.clothes.push({
			id: db.clothes.length,
			name,
			type,
			color,
			material,
			origin,
			score: Math.ceil(Math.random() * 100),
			wornCounter: 0,
			img,
			gw,
			ms,
			ts,
			goalNumber,
			dateAdded
		});
		writeObject('db', db);
		goto('/wardrobe');
	}
	const originsList = {
		germany: 1,
		afghanistan: 4921,
		albania: 1339,
		armenia: 2924,
		argentina: 12280,
		austria: 503,
		australia: 14466,
		azerbaijan: 3094,
		'bosnia and herzegovina': 971,
		barbados: 7478,
		bangladesh: 7291,
		belgium: 426,
		bulgaria: 1472,
		bolivia: 10345,
		brazil: 9432,
		bahamas: 7723,
		bhutan: 6987,
		belarus: 1216,
		canada: 6751,
		switzerland: 510,
		chile: 12514,
		china: 7224,
		colombia: 9246,
		'costa rica': 9455,
		cuba: 8041,
		'cape verde': 5025,
		'czech republic': 385,
		denmark: 570,
		dominica: 7416,
		'dominican republic': 7750,
		algeria: 2676,
		egypt: 3205,
		spain: 1617,
		finland: 1512,
		france: 816,
		'united kingdom': 1033,
		ghana: 4920,
		gibraltar: 2090,
		greenland: 3438,
		gambia: 4791,
		greece: 1610,
		croatia: 761,
		hungary: 794,
		indonesia: 11011,
		ireland: 1292,
		israel: 3002,
		india: 6752,
		iraq: 3341,
		iran: 4064,
		iceland: 2277,
		italy: 1046,
		jordan: 3121,
		japan: 9048,
		'north korea': 8154,
		'south korea': 8570,
		liechtenstein: 449,
		montenegro: 1157,
		macedonia: 1368,
		netherlands: 372,
		norway: 1042,
		'new zealand': 18364,
		poland: 607,
		portugal: 1951,
		romania: 1213,
		serbia: 1120,
		russia: 5421,
		sweden: 1119,
		singapore: 10125,
		slovenia: 650,
		slovakia: 717,
		syria: 2918,
		swaziland: 8881,
		thailand: 8677,
		turkey: 2355,
		ukraine: 1514,
		'united states': 7861,
		vietnam: 9328,
		yemen: 5204,
		'south africa': 9170,
		zimbabwe: 8015,
		georgia: 2666,
		guatemala: 9369,
		luxembourg: 341,
		mexico: 9448,
		taiwan: 9293
	};
</script>

<svelte:head>
	<title>Add new Item | WearPerformance</title>
</svelte:head>

<div class="addPage">
	<div class="headerBar">Add new Item</div>

	<div class="inputs" class:hidden={!accepted}>
		<img class="acceptedImage" src={img} alt="Item" />
		<select required bind:value={type}>
			<option value="hose">Hose</option>
			<option value="tshirt">T-Shirt</option>
			<option value="pulli">Pulli</option>
		</select>
		<input required placeholder="Name" bind:value={name} />
		<select required bind:value={origin}>
			{#each Object.keys(originsList) as key}
				<option value={key}>{key[0].toUpperCase() + key.substring(1)}</option>
			{/each}
		</select>
		<select required bind:value={material}>
			<option value="kunststoff">Kunststoff</option>
			<option value="leder">Leder</option>
			<option value="Pelz">Pelz</option>
			<option value="Baumwolle">Baumwolle</option>
			<option value="bioBaumwolle">Bio Baumwolle</option>
		</select>
	</div>
	<div class="camera" class:hidden={accepted}>
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

	img {
		width: 100%;
		height: auto;
		border-radius: 20px;
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
