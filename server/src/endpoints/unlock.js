
import express from 'express'
import * as Util from '../utils/helper.js';
import * as DB from '../utils/db.js';

const relay = Util.relay();

var router = express.Router();

router.get('/', async function(req, res, next) {
	let data;
	if (relay) {
		data = await Util.getSnapRequest(req.originalUrl);
		if ( data && data['lens_id'] ) DB.insertUnlock(data);
	} else {
		const uid = req?.query?.uid && parseInt(req.query.uid) || false;
		if (!uid) return res.json({});
		const lens = await DB.getLensUnlock(uid);
		if (lens && lens[0]) {
			data = Util.modifyResponseURLs(lens[0]);
		};
	}
	
	res.json(data);
});

export default router;