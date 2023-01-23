
import express from 'express'
import * as Util from '../utils/helper.js';
import * as DB from '../utils/db.js';

var router = express.Router();

router.post('/', async function(req, res, next) {

	//using the report lens feature of the app to try and redownload everything incase s3 missed it.
	const body = req.body;
	if ( body && body['lens_id'] && parseInt(body['lens_id']) ) {
		let lens = await DB.getSingleLens(parseInt(body['lens_id']));
		if (lens) DB.insertLens(...lens, true); //re-mirror the lens
		res.json({})
	} else {
		res.json({});
	}


});

export default router;