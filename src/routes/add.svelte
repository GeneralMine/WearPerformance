<script>
	import { goto } from '$app/navigation';

	import Button from '$lib/Common/Button.svelte';
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
</script>

<Button on:click={add}>Add</Button>
