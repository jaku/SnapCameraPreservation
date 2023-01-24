import express from 'express'
import * as Util from '../../utils/helper.js';
import * as DB from '../../utils/db.js';

import fs from 'fs';

const wfh = JSON.parse(fs.readFileSync('./src/json/wfh.json'));
const color_effect = JSON.parse(fs.readFileSync('./src/json/color_effect.json'));
const funny = JSON.parse(fs.readFileSync('./src/json/funny.json'));
const gaming = JSON.parse(fs.readFileSync('./src/json/gaming.json'));
const cute = JSON.parse(fs.readFileSync('./src/json/cute.json'));
const character = JSON.parse(fs.readFileSync('./src/json/character.json'));

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

	let data;

	if (relay) {

		data = await Util.getSnapRequest(req.originalUrl);

		if ( data && data['lenses'] ) {
			DB.insertLens(data['lenses'])
			for (var j = 0; j < data['lenses'].length; j++){ 
				data['lenses'][j].lens_name = `${data['lenses'][j].lens_name}`;
			};
		};

	} else {

        const {category, limit, offset} = req.query;
		if (!category || offset === 31) return res.json({});
		if (!originalResponses[category]) return res.json({});
		data = Util.modifyResponseURLs(originalResponses[category]);

	};
	
	res.json(data);

});

export default router;