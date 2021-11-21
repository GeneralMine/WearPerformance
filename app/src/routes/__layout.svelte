<script>
	import '../app.css';

	import { writeObject, readObject } from '$lib/localstorage';

	if (!readObject('db') || !readObject('db').clothes) {
		writeObject('db', {
			created: new Date(),
			clothes: []
		});
	}
</script>

<div class="layoutParent">
	<div class="padding">
		<slot />
	</div>
</div>

<style>
	.layoutParent {
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100vw;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.padding {
		width: 90%;
		height: 90%;
	}
</style>
