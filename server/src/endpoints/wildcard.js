
import express from 'express'
import * as Util from './../utils/helper.js';
import * as DB from './../utils/db.js';

var router = express.Router();

router.get('/', async function(req, res, next) {
	console.log("Undocumented GET URL:", req.originalUrl)
	const response = await Util.getSnapRequest(req.originalUrl);
	res.json(response);

});

router.post('/', async function(req, res, next) {
	let body;
	if (req.body) body = req.body;
	console.log("Undocumented POST URL:", req.originalUrl)
	const response = await Util.postSnapRequest(req.originalUrl, body);
	res.json(response);

});

export default router;