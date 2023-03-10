
import express from 'express'

import * as Util from '../utils/helper.js';
import * as DB from '../utils/db.js';

const relay = Util.relay();

var router = express.Router();

router.get('/', async function(req, res, next) {

	const data = await Util.getSnapRequest(req.originalUrl);

	if ( data && data['lenses'] ) {
		DB.insertLens(data['lenses'])
		for (var j = 0; j < data['lenses'].length; j++){ 
			data['lenses'][j].lens_name = `*${data['lenses'][j].lens_name}`;
		};
	};
	
	res.json(data);

});

router.post('/', async function(req, res, next) {

	const body = req.body;
	if (!body || !body['lenses'] ) return res.json({});
	const lenses = body['lenses'];
	let lens;

	if (relay) {
		if ( lenses.length === 1 ) {
			lens = await DB.getSingleLens(parseInt(lenses[0])); 
		} else if ( lenses.length > 1 ) {
			lens = await DB.getMultipleLenses((lenses));
		};

		if (!lens) { //if our server doesnt find a lens, lets search their servers.
			const data = await Util.postSnapRequest(req.originalUrl, req.body);
			if ( data && data['lenses'] ) {
				lens = data['lenses'];
				DB.insertLens(data['lenses']);
			};
		}; 
		
		if (!lens) { return res.json() }
		for (var j = 0; j < lens.length; j++){ //update all lenses names
			lens[j].lens_name = `*${lens[j].lens_name}`;
		};

	} else {

		if ( lenses.length === 1 ) {
			lens = await DB.getSingleLens(parseInt(lenses[0])); 
		} else if ( lenses.length > 1 ) {
			lens = await DB.getMultipleLenses((lenses));
		};

		if (lens) lens = Util.modifyResponseURLs(lens);

	};

	return res.json({"lenses": lens});


});

export default router;