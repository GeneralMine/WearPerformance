const fetch = (url) => import('node-fetch').then(({ default: fetch }) => fetch(url));

const imgurEndpoint = 'https://api.imgur.com/3/image';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
module.exports = async (req, res) => {
	console.log('Got an image');
	console.log(req);
	let options = {
		method: 'POST',
		headers: {
			Authorization: 'Client-ID a115d420f5503cc'
		},
		body: req.body
	};
	const response = await fetch(imgurEndpoint, options);
	return res.status(200).json(response.json());
};
