
import express from 'express'

import * as Util from '../utils/helper.js';
import * as DB from '../utils/db.js';

const relay = Util.relay();
let originalResponse = {"items":[{"id":"wfh","description":"You're going to want more meetings","title":"Work & Study from Home","lens_count":31,"thumbnails":{"primary":"https://storage.googleapis.com/snap-camera-categories-media/WnSFH%20(1).png"},"labels":{"secondary":"New"},"author":{}},{"id":"color_effect","description":"Winter is here","title":"Winter❄️","lens_count":31,"thumbnails":{"primary":"https://storage.googleapis.com/snap-camera-categories-media/Winter.png"},"labels":{"secondary":"New"},"author":{}},{"id":"funny","description":"Laughter guaranteed!","title":"Funny","lens_count":32,"thumbnails":{"primary":"https://storage.googleapis.com/snap-camera-categories-media/funny_05%20(1).png"},"labels":{"secondary":"New"},"author":{}},{"id":"gaming","description":"It's time to try new style!","title":"Makeup","lens_count":31,"thumbnails":{"primary":"https://storage.googleapis.com/snap-camera-categories-media/Makeup_3%20(1).png"},"labels":{"secondary":"New"},"author":{}},{"id":"cute","description":"Cuteness overload! 🌈🌟🔥","title":"Cute","lens_count":31,"thumbnails":{"primary":"https://storage.googleapis.com/snap-camera-categories-media/cute_07.png"},"labels":{"secondary":"New"},"author":{}},{"id":"character","description":"Enjoy new backgrounds","title":"Backgrounds","lens_count":22,"thumbnails":{"primary":"https://storage.googleapis.com/snap-camera-categories-media/BG_2.png"},"labels":{"secondary":"New"},"author":{}}]};

const jakuBackup = {
	"id": "jakubackup",
	"description": "NO RELAY",
	"descriptionOld": "If you are seeing this, then your lenses are being backed up. A * in the name means it's been saved.",
	"title": "Jaku Snap Backup!",
	"lens_count": 0,
	"thumbnails": {
		"primary": "https://pbs.twimg.com/profile_banners/5156901/1538283904/600x200"
	},
	"labels": {
		"secondary": ""
	},
	"author": {
		"name": "twitter.com/jaku",
		"link": "https://twitter.com/jaku",
	}
};

var router = express.Router();

router.get('/', async function(req, res, next) {
	let data;
	if (relay) {
		data = await Util.getSnapRequest(req.originalUrl);
	} else {
		data = Util.modifyResponseURLs(originalResponse);
	};

	if (data && data['items']) data['items'].unshift(jakuBackup);
	
	res.json(data);
});

export default router;

