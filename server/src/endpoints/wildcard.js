
import express from 'express'
import * as Util from '../utils/helper.js';

var router = express.Router();

const relay = Util.relay();


router.get('/', async function(req, res, next) {
	let response;
	console.log("Undocumented GET URL:", req.originalUrl)
	if (relay) response = await Util.getSnapRequest(req.originalUrl);
	
	res.json(response);

});

router.post('/', async function(req, res, next) {
	let response,body;
	if (req.body) body = req.body;
	console.log("Undocumented POST URL:", req.originalUrl)
	if (relay) response = await Util.postSnapRequest(req.originalUrl, body);

	res.json(response);

});

export default router;