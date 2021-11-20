<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/Common/Button.svelte';
	import { readObject, writeObject } from '$lib/localstorage';
	import TabViewHeader from '$lib/Views/TabView/TabViewHeader.svelte';
	import TabViewHeaderItem from '$lib/Views/TabView/TabViewHeaderItem.svelte';
	import { onMount } from 'svelte';

	let supported = true;
	let selectedFileUploadMethod = 'UPLOAD';
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

	/* Camera Stuff */
	let videoEl;
	let loading = false;
	onMount(async () => {
		try {
			if ('mediaDevices' in navigator) {
				supported = true;
			} else {
				supported = false;
				return;
			}
			loading = true;
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true
			});
			videoEl.srcObject = stream;
			videoEl.play();
			loading = false;
		} catch (error) {
			console.log(error);
		}
	});
</script>

<Button on:click={add}>Add</Button>

{#if supported}
	<TabViewHeader>
		<TabViewHeaderItem
			selected={selectedFileUploadMethod === 'Upload'}
			on:click={() => (selectedFileUploadMethod = 'Upload')}>Upload</TabViewHeaderItem
		>
		<TabViewHeaderItem
			selected={selectedFileUploadMethod === 'Drag-And-Drop'}
			on:click={() => (selectedFileUploadMethod = 'Drag-And-Drop')}>Drag-And-Drop</TabViewHeaderItem
		>
		<TabViewHeaderItem
			selected={selectedFileUploadMethod === 'Copy-Paste'}
			on:click={() => (selectedFileUploadMethod = 'Copy-Paste')}>Copy-Paste</TabViewHeaderItem
		>
		<TabViewHeaderItem
			selected={selectedFileUploadMethod === 'URL'}
			on:click={() => (selectedFileUploadMethod = 'URL')}>URL</TabViewHeaderItem
		>
	</TabViewHeader>
	{#if selectedFileUploadMethod === 'Upload'}
		<!-- https://developers.google.com/web/fundamentals/media/capturing-images#file_input -->
		<input type="file" accept="image/*" />
	{:else if selectedFileUploadMethod === 'Drag-And-Drop'}
		<!-- TODO: Drag-And-Drop https://developers.google.com/web/fundamentals/media/capturing-images#drag_and_drop -->
	{:else if selectedFileUploadMethod === 'Copy-Paste'}
		<!-- TODO: Copy-Paste https://developers.google.com/web/fundamentals/media/capturing-images#paste_from_clipboard -->
	{:else if selectedFileUploadMethod === 'URL'}
		<!-- TODO: URL https://developers.google.com/web/fundamentals/media/capturing-images#ask_for_a_url -->
	{/if}
{:else}
	{#if loading}
		<h1>CARGANDO</h1>
	{/if}
	<!-- svelte-ignore a11y-media-has-caption -->
	<video bind:this={videoEl} />
{/if}

<style>
	video {
		width: 100%;
		height: 100%;
	}
</style>
