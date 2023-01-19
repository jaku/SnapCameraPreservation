import * as dotenv from 'dotenv';
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import {Headers} from 'node-fetch';
import mysql from "mysql2";
import AWS from 'aws-sdk';

dotenv.config()
const app = express();


const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME
});

const serverPort = process.env.PORT;

const s3Bucket = "lens-storage-reversesnapcht.jaku.tv"; //
const backupDomain = "snapchatreverse.jaku.tv";

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept',
		)
	if ('OPTIONS' === req.method) {
		res.sendStatus(200)
	} else {
		next()
	}
});

app.use(express.json());


async function insertUnlock(lens) {

	let { lens_id, lens_url, signature, hint_id, additional_hint_ids } = lens;

	if ( !additional_hint_ids ) additional_hint_ids = {};
	if ( !hint_id ) hint_id = "";
	if ( !signature ) signature = "";

	return new Promise(resolve => {
		connection.query(`INSERT INTO unlocks (lens_id, lens_url, signature, hint_id, additional_hint_ids) VALUES (${lens_id}, '${lens_url}', '${signature}', '${hint_id}', '${JSON.stringify(additional_hint_ids)}')`, function (err, results) {
			if (err && err.code !== "ER_DUP_ENTRY") {
				console.log(err, lens_id)
			}
			if (!err) {
				console.log("INSERTED LENS", lens_id)
				saveLens(lens_id, lens_url);
			}
		});
	});

};

function updateLens(id) {
  //setting this so we know if we have it mirrored on S3
	connection.query(`UPDATE unlocks SET mirrored=1 WHERE lens_id='${id}'`)
}

function lensSearch(term) {
	return new Promise(resolve => {
		connection.query(`SELECT * FROM lenses WHERE lens_name LIKE '%${term}%' LIMIT 32;`, async function(err, results) {
			if ( results && results[0] ) {
				for (var j = 0; j < results.length; j++){
					results[j].unlockable_id = `${results[j].unlockable_id}`;
				};
				resolve(results);
			} else {
				resolve({});
			}
		})
	});
}

async function insertLens(lens) {

	let { unlockable_id, snapcode_url, user_display_name, lens_name, lens_status, deeplink, icon_url, thumbnail_media_url, 
	thumbnail_media_poster_url, standard_media_url, standard_media_poster_url, obfuscated_user_slug, image_sequence } = lens;

	if ( !image_sequence ) image_sequence = {};
	if ( !thumbnail_media_url ) thumbnail_media_url = "";
	if ( !thumbnail_media_poster_url ) thumbnail_media_poster_url = "";
	if ( !obfuscated_user_slug ) obfuscated_user_slug = "";
	if ( !standard_media_poster_url ) standard_media_poster_url = "";
	if ( !standard_media_url ) standard_media_url = "";

	const response = await fetch(`https://${backupDomain}/vc/v1/explorer/unlock?uid=${unlockable_id}`, {method: 'GET', headers}); //hits our own service on every unlockable ID to make sure it gets the additional details about the lens

	return new Promise(resolve => {
		connection.query(`INSERT INTO lenses (unlockable_id, snapcode_url, user_display_name, lens_name, lens_status, deeplink, icon_url, thumbnail_media_url, thumbnail_media_poster_url, standard_media_url, standard_media_poster_url, obfuscated_user_slug, image_sequence) VALUES 
			(${unlockable_id}, '${snapcode_url}', ${connection.escape(user_display_name)}, '${lens_name}', '${lens_status}', '${deeplink}', '${icon_url}', '${thumbnail_media_url}', 
			'${thumbnail_media_poster_url}', '${standard_media_url}', '${standard_media_poster_url}', '${obfuscated_user_slug}', '${JSON.stringify(image_sequence)}')`, function (err, results) {
				if (err && err.code !== "ER_DUP_ENTRY") {
					console.log(err, lens_name)
				} 
				if ( !err) {
					console.log("Inserted", unlockable_id, lens_name)
					//lens data is saved, now to get the images/mp4s/etc

					savePNG(icon_url); 
					savePreviews(thumbnail_media_poster_url);
					savePreviews(standard_media_url);
					savePreviews(standard_media_poster_url);

					//this is frames of the video as jpg, so we need to back up each frame...
					if (image_sequence && image_sequence?.size) {
						let { url_pattern, size } = image_sequence;
						for (let i = 0; i < size; i++) {
  						savePreviews(url_pattern.replace('%d', i));
						}
					};


				}
			});
	});

};

const meta = {
	'X-Installation-Id': 'default'
};
const headers = new Headers(meta);



//this endpoint doesn't actually seem to pop up anywhere?
app.get('/vc/v1/update/latest', async function(req, res, next) {
	res.json({
		"version": "1.21.0",
		"notes": "What's new:\r\n- Nothing."
	})
})


app.get(['/vc/v1/explorer/lenses','/vc/v1/explorer/top', '/vc/v1/explorer/category/lenses'], async function(req, res, next) {
	const url = req.url;

	const response = await fetch(`https://studio-app.snapchat.com${url}`, {method: 'GET', headers});
	if (response.status !== 200) return res.json({});
	const data = await response.json();

	if ( data && data['lenses'] ) {
		data['lenses'].forEach(function(lens, index) {
			insertLens(lens);
		})	

		for (var j = 0; j < data['lenses'].length; j++){
			data['lenses'][j].lens_name = `*${data['lenses'][j].lens_name}`;
		};
	}
	
	res.json(data);
});

app.get('/vc/v1/explorer/unlock', async function(req, res, next) {
	const url = req.url;
	const {uid} = req.query;

	const response = await fetch(`https://studio-app.snapchat.com${url}`, {method: 'GET', headers});
	if (response.status !== 200) return res.json({});
	const data = await response.json();
	if ( data && data['lens_id'] ) {
		insertUnlock(data);
		return res.json(data);
	}
	
	res.json({});
});

app.get('/vc/v1/explorer/categories', async function(req, res, next) {
	const url = req.url;

	const response = await fetch(`https://studio-app.snapchat.com${url}`, {method: 'GET', headers});
	if (response.status !== 200) return res.json({});
	const data = await response.json();
	const jakuBackup = {
		"id": "jakubackup",
		"description": "If you are seeing this, then your lenses are being backed up. A * in the name means it's been saved.",
		"title": "Jaku Snap Backup!",
		"lens_count": 0,
		"thumbnails": {
			"primary": "https://pbs.twimg.com/profile_banners/5156901/1538283904/600x200"
		},
		"labels": {
			"secondary": ""
		},
		"author": {
			"name": "twitter.com/jaku",
			"link": "https://twitter.com/jaku",
		}
	};


	data['items'].unshift(jakuBackup)
	res.json(data);


});

app.post(['/vc/v1/explorer/search','/vc/v1/explorer/lenses'], async function(req, res, next) {
	const url = req.url;
	const body = req.body;
	
	let searchResults;
	if (body) {
		if ( body && body['query'] ) {
			searchResults = await lensSearch(body['query']);		
		}
	};

	//searching is weird, some search results don't work at all against their servers, so we first try to search against them
	//if it doesnt work we then just use results from our database, and if it does work we'll still merge our data

	const response = await fetch(`https://studio-app.snapchat.com${url}`, {method: 'POST', body: JSON.stringify(body), headers});
	if (response.status !== 200) return res.json({});
	let data;
	
	try {
		data = await response.json();
	} catch (e) {

		for (var j = 0; j < searchResults.length; j++){
			searchResults[j].lens_name = `*${searchResults[j].lens_name}`;
		};

		return res.json({"lenses": [...searchResults]})
	}


	if ( data && data['lenses'] ) {
		data['lenses'].forEach(function(lens, index) {
			insertLens(lens);
		})	

		if (searchResults) {

			let array3 = data['lenses'].concat(searchResults);
			array3 = array3.filter((item,index)=>{
				return (array3.indexOf(item) == index)
			})

			for (var j = 0; j < array3.length; j++){
				array3[j].lens_name = `*${array3[j].lens_name}`;
			};

			return res.json({"lenses": [...array3]})

		};

	}
	
	if ( data['lenses'] ) {
		for (var j = 0; j < data['lenses'].length; j++){
			data['lenses'][j].lens_name = `*${data['lenses'][j].lens_name}`;
		};
	}


	res.json(data);
});


app.get('/vc/v1/explorer/scheduled', async function(req, res, next) {
	const url = req.url;

	const response = await fetch(`https://studio-app.snapchat.com${url}`, {method: 'GET', headers});
	if (response.status !== 200) return res.json({});
	const data = await response.json();
	for (var j = 0; j < data['lenses'].length; j++){
		data['lenses'][j].lens_name = `*${data['lenses'][j].lens_name}`;
	};

	res.json(data)

});


//unknown GET requests
app.get('*', async function(req, res, next) {
	const url = req.url;
	const response = await fetch(`https://studio-app.snapchat.com${url}`, {method: 'GET', headers});
	
	let data;
	try {
		data = await response.json();
	} catch (e) {
		return res.json("")
	}

	console.log("Unknown GET URL:", req.url);
	if ( data ) {
		return res.json(data)
	}
	res.json({});
});

//unknown POST requests, not sending the data along to snap chat at this time.
app.post('*', async function(req,res,next) {
	console.log("Unknown POST URL:", req.url);
	res.json({});
})


function savePreviews(url) {
	
	if (!url.includes("preview-media")) return;

	let name = url.split('/');
	
	if (url.includes('thumbnail_seq')) {
		name = `preview-media/thumbnail_seq/${name[5]}/${name[6]}`;
	};

	if (url.includes('thumbnail_poster')) {
		name = `preview-media/thumbnail_poster/${name[5]}`;
	};

	if (url.includes('/final/')) {
		name = `preview-media/final/${name[5]}`;	
	};

	if (url.includes('/final_poster/')) {
		name = `preview-media/final_poster/${name[5]}`;	
	}

	fetch(url)
	.then(res => res.arrayBuffer())
	.then(x => { 
		const params = {
			Bucket: s3Bucket,
			Key: name,
			Body: Buffer.from(x),
			ACL:'public-read'
		};

		s3.upload(params, function(s3Err, data) {
			if (s3Err) throw s3Err
				console.log(`Mirrored ${data.Location}`)
		});

	})
	
};


function savePNG(url) {

	if (!url.includes('png')) {
		console.log(url, "does not contain PNG. Do not backup.")
		return;
	};

	const name = url.split('/')[4];
	
	fetch(url)
	.then(res => res.arrayBuffer())
	.then(x => { 
		const params = {
			Bucket: s3Bucket,
			Key: `png/${name}`,
			Body: Buffer.from(x),
			ACL:'public-read'
		};

		s3.upload(params, function(s3Err, data) {
			if (s3Err) throw s3Err
				console.log(`Mirrored ${data.Location}`)
		});

	})
	
};


function saveLens(id, url) {

	let key = url.split('/')[3];
	if ( url.split('/')[4] ) {
		key = `${url.split('/')[3]}/${url.split('/')[4]}`
	};

	fetch(url)
	.then(res => res.arrayBuffer())
	.then(x => { 
		const params = {
			Bucket: s3Bucket,
			Key: key,
			Body: Buffer.from(x),
			ACL:'public-read'
		};

		s3.upload(params, function(s3Err, data) {
			if (s3Err) throw s3Err
				console.log(`Mirrored ${data.Location}`)
				updateLens(id);
		});

	})

};


app.listen(serverPort, () => {
	console.log(`Snap Chat Backup is running on port ${serverPort}`);
});