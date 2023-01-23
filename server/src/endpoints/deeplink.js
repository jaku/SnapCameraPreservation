
import express from 'express'
import * as Util from '../utils/helper.js';
import * as DB from '../utils/db.js';

var router = express.Router();

router.post('/', async function(req, res, next) {

	const body = req.body;
	if (!body || !body['deeplink']) return res.json({});

	const data = await Util.postSnapRequest(req.originalUrl, req.body);
	if ( data && data['lenses'] ) DB.insertLens(data['lenses']);

	res.json(data);
});

export default router;