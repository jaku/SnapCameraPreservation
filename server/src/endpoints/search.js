
import express from 'express'
import * as Util from '../utils/helper.js';
import * as DB from '../utils/db.js';

const relay = Util.relay();

var router = express.Router();

router.post('/', async function(req, res, next) {

	const body = req.body;
		
	if ( !body|| !body['query'] ) return res.json();
	let searchResults, data;
	const searchTerm = body['query'];

		if (relay) {

			if ( searchTerm.includes("https://lens.snapchat.com/") ) {
				var uuid = searchTerm.split("/")[3] || false;
				if (!uuid) return res.json({});

				const deepLinkBody = {
					"deeplink": `https://www.snapchat.com/unlock/?type=SNAPCODE&uuid=${uuid}&metadata=01`
				};

				const deepLinkSearchResponse = await Util.postSnapDeeplink(deepLinkBody);
				if ( !deepLinkSearchResponse ) return res.json({});
				
				if ( deepLinkSearchResponse && deepLinkSearchResponse['lenses'] ) {
					DB.insertLens(deepLinkSearchResponse['lenses']);
				};

				return res.json(deepLinkSearchResponse);

			};

			searchResults = await DB.lensSearch(searchTerm);	//searches our DB for lenses
			
			//searching is weird, some search results don't work at all against their servers, so we first try to search against them
			//if it doesnt work we then just use results from our database, and if it does work still merge our data with theres
			data = await Util.postSnapRequest(req.originalUrl, body);
			if ( data && !data[0] ) {		
				if ( searchResults ) {
					for (var j = 0; j < searchResults.length; j++){
						searchResults[j].lens_name = `*${searchResults[j].lens_name}`;
					};
					return res.json({"lenses": searchResults}); //server didnt like the request, just give them our search results
				}
				return res.json({"lenses": []})
			}
			if ( data && !data['lenses'] && !searchResults ) return res.json({"lenses": []}); //nothing found either server, send nothing
			if ( data && !data['lenses'] && searchResults ) return res.json({"lenses": searchResults}); //nothing found on server, send our results
				
			DB.insertLens(data['lenses']);

			if (searchResults) { //if we have search results from our search and data from snapchat, time to merge it

				let array = data['lenses'].concat(searchResults);
					array = array.filter((item,index)=>{
					return (array.indexOf(item) == index)
				})

				for (var j = 0; j < array.length; j++){
					if ( array[j].lens_name ) array[j].lens_name = `*${array[j].lens_name}`;
				};

				return res.json({"lenses": array})

			};

			//if we dont have any search results
			for (var j = 0; j < data['lenses'].length; j++){
				data['lenses'][j].lens_name = `*${data['lenses'][j].lens_name}`;
			};

		} else {
			searchResults = await DB.lensSearch(searchTerm);
			if (searchResults) {
				data = Util.modifyResponseURLs(searchResults);
				data = {"lenses": data};
			};
		};

	res.json(data);

});

export default router;