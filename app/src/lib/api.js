export function sendImageToAPI(image) {
	return new Promise((resolve, reject) => {
		const formData = new FormData();
		formData.append('image', image);
		fetch('http://localhost:3000/api/image', {
			method: 'POST',
			body: formData
		})
			.then((res) => res.json())
			.then((data) => resolve(data))
			.catch((err) => reject(err));
	});
}
