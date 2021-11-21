const KEY = '87f42a45f8f745b2af73b30179fed3a2';

const azureURL =
	'https://detectoraiv2.cognitiveservices.azure.com/vision/v3.2/detect?model-version=latest';

export async function getPersonFromAzure(imageURL) {
	console.log('Sending image to Azure...', imageURL);
	const res = await fetch(azureURL, {
		method: 'POST',
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		redirect: 'follow', // manual, *follow, error
		referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		headers: {
			'Ocp-Apim-Subscription-Key': KEY,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ url: imageURL })
	});
	return res.json();
}
