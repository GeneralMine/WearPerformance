require('dotenv').config();
// Express
const express = require('express');
const app = express();
const multer = require('multer');

const upload = multer({
	dest: 'images',
	limits: { fileSize: 1000000 },
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
			cb(new Error('Please upload an image.'));
		}
		cb(undefined, true);
	}
});

// Setup env
const PORT = process.env.PORT || 23101;
const DOMAIN = process.env.DOMAIN || 'localhost';
const isDebug = DOMAIN.startsWith('localhost') || DOMAIN === '127.0.0.1';

// Cors Stuff
const cors = require('cors');
const corsOptionsProduction = {
	methods: 'GET, OPTIONS, POST, DELETE',
	credentials: true,
	optionsSuccessStatus: 200,
	origin: ['https://raiser.dev', /\.raiser\.dev$/]
};
const corsOptionsDebug = {
	origin: function (origin, callback) {
		return callback(null, true);
	},
	optionsSuccessStatus: 200,
	credentials: true
};

async function startup() {
	app.enable('trust proxy');
	if (!isDebug) {
		app.use(cors(corsOptionsProduction));
		console.log('CORS loaded in production!');
	} else {
		app.use(cors(corsOptionsDebug));
		console.log('CORS loaded in debug!');
	}

	// Configure cors for all routes
	app.options('*', cors());

	// Routes
	app.get('/', (req, res) => {
		res.send('Go away!');
	});

	app.post('/upload', upload.single('upload'), (req, res) => {
		if (req.file) {
			res.json(req.file);
		} else {
			console.log(res);
		}
	});

	app.listen(PORT, () => {
		console.log(`WearPerformance listening at http://localhost:${PORT}`);
	});
}

startup().catch((err) => {
	console.error(err);
});
