const REFRESH_TOKEN = 'dba8635162676a5f2008b93379fabc3dd3ccc55f';
const ACCESS_TOKEN = '631da1d44ba239fc742bf3bbea1db0630cf59d1d';

const imgurURL = 'https://api.imgur.com/3/image';

export async function uploadImageToImgur(image) {
	const formData = new FormData();
	formData.append('image', image.split(',')[1]);

	// Registration
	console.log('Sending image to API', image);
	const res = await fetch(imgurURL, {
		method: 'POST',
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		redirect: 'follow', // manual, *follow, error
		referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		headers: {
			Authorization: 'Bearer ' + ACCESS_TOKEN
		},
		body: formData
	});
	return res.json();
}
