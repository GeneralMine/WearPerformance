const imgurEndpoint = 'https://api.imgur.com/3';

export async function uploadImage(image) {
	const formData = new FormData();
	formData.append('image', image);
	formData.append('type', 'base64');

	const response = await fetch(imgurEndpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'multipart/form-data',
			Authorization: 'Client-ID a115d420f5503cc'
		},
		body: formData
	});
	return response.json();
}
