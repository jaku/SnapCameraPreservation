
import express from 'express'

const jakuBackup = {
	"id": "jakubackup",
	"description": "If you are seeing this, then your lenses are being backed up. A * in the name means it's been saved.",
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
	const data = await Util.getSnapRequest(req.originalUrl);
	if (data && data['items']) data['items'].unshift(jakuBackup)
	res.json(data);
});

export default router;