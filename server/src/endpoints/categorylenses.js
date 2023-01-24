
import express from 'express'

import * as Util from '../utils/helper.js';
import * as DB from '../utils/db.js';

import * as wfh from '../json/wfh.json';
import * as color_effect from '../json/color_effect.json';
import * as funny from '../json/funny.json';
import * as gaming from '../json/gaming.json';
import * as cute from '../json/cute.json';
import * as character from '../json/character.json';

const originalResponses = {
    wfh,
    color_effect, //winter
    funny, 
    gaming, //makeup
    cute,
    character
};

const relay = Util.relay();

var router = express.Router();

router.get('/', async function(req, res, next) {

	const data = await Util.getSnapRequest(req.originalUrl);

	if ( data && data['lenses'] ) {
		DB.insertLens(data['lenses'])
		for (var j = 0; j < data['lenses'].length; j++){ 
			data['lenses'][j].lens_name = `${data['lenses'][j].lens_name}`;
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

        const data = await Util.postSnapRequest(req.originalUrl, req.body);
        if ( data && data['lenses'] ) {
            lens = data['lenses'];
            DB.insertLens(data['lenses']);
        };

		if (!lens) { return res.json() }
		for (var j = 0; j < lens.length; j++){ //update all lenses names
			lens[j].lens_name = `${lens[j].lens_name}`;
		};

	} else {

        const {category, limit, offset} = req.query;
		if (!category || offset === 31) return res.json({});

		lens = Util.modifyResponseURLs(originalResponses[category]);

        return res.json(lens);
	};

	return res.json({"lenses": lens});


});

export default router;