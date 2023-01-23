
import express from 'express'
import * as Util from '../utils/helper.js';
import * as DB from '../utils/db.js';

var router = express.Router();

router.get('/', async function(req, res, next) {

	const data = await Util.getSnapRequest(req.originalUrl);

	if ( data && data['lens_id'] ) {
		DB.insertUnlock(data);
	};
	
	res.json(data);

});

export default router;