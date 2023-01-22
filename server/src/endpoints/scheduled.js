
import express from 'express'
import * as Util from './../utils/helper.js';
import * as DB from './../utils/db.js';

var router = express.Router();

router.get('/', async function(req, res, next) {

	const data = await Util.getSnapRequest(req.originalUrl);
	
	if (data && data['lenses']) {
		for (var j = 0; j < data['lenses'].length; j++){
			data['lenses'][j].lens_name = `*${data['lenses'][j].lens_name}`;
		};
	};

	res.json(data);

});

export default router;