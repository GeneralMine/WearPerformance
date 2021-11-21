const imgurEndpoint = 'https://api.imgur.com/3/image';

export async function uploadImage(image) {
	const formData = new FormData();
	formData.append('image', image);

	let options = {
		method: 'POST',
		headers: {
			Authorization: 'Client-ID a115d420f5503cc'
		},
		body: formData
	};
	console.log(options);
	console.log('formData', formData);
	const response = await fetch(imgurEndpoint, options);
	return response.json();
}
