<script>
	import '../app.css';

	import { writeObject, readObject } from '$lib/localstorage';

	if (!readObject('db') || !readObject('db').clothes) {
		writeObject('db', {
			created: new Date(),
			clothes: [
				{
					name: 'T-Shirt',
					type: 'top',
					color: 'white',
					size: 'M',
					price: '10',
					image:
						'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
				},
				{
					name: 'Jeans',
					type: 'bottom',
					color: 'blue',
					size: 'L',
					price: '20',
					image:
						'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
				},
				{
					name: 'Shoes',
					type: 'shoes',
					color: 'black',
					size: '42',
					price: '30',
					image:
						'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
				}
			]
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
