import AWS from 'aws-sdk';
import fetch from "node-fetch";
import {Headers} from 'node-fetch';
import * as dotenv from 'dotenv';

import * as DB from './db.js';

dotenv.config()

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3Bucket = process.env.S3BUCKET;
const s3URL = process.env.S3URL;
const backupDomain = process.env.BACKUPDOMAIN;
if (!backupDomain) {
	console.log("Missing BACKUPDOMAIN in .env file"); 
	process.exit();	
};

const snapHeaders = {
	'X-Installation-Id': 'default'
};
const headers = new Headers(snapHeaders);


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
				//console.log(`Mirrored ${data.Location}`)
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
				//console.log(`Mirrored ${data.Location}`)
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
				//console.log(`Mirrored ${data.Location}`)
				DB.updateLens(id);
		});

	})

};


function backupImages() {

		// connection.query(`SELECT * FROM lenses WHERE mirrored=0 LIMIT 1;`, async function(err, results) {
		// 	if (!results) return;
		// 	let { unlockable_id, snapcode_url, user_display_name, lens_name, lens_status, deeplink, icon_url, thumbnail_media_url, 
		// 	thumbnail_media_poster_url, standard_media_url, standard_media_poster_url, obfuscated_user_slug, image_sequence } = results[0];

		// 	if ( !image_sequence ) image_sequence = {};
		// 	if ( !thumbnail_media_url ) thumbnail_media_url = "";
		// 	if ( !thumbnail_media_poster_url ) thumbnail_media_poster_url = "";
		// 	if ( !obfuscated_user_slug ) obfuscated_user_slug = "";
		// 	if ( !standard_media_poster_url ) standard_media_poster_url = "";
		// 	if ( !standard_media_url ) standard_media_url = "";

	
		// 	savePNG(icon_url); 
		// 	savePNG(snapcode_url);
		// 	savePreviews(thumbnail_media_poster_url);
		// 	savePreviews(standard_media_url);
		// 	savePreviews(standard_media_poster_url);

		// 	//this is frames of the video as jpg, so we need to back up each frame...
		// 	if (image_sequence && image_sequence?.size) {
		// 		let { url_pattern, size } = image_sequence;
		// 		for (let i = 0; i < size; i++) {
		// 			savePreviews(url_pattern.replace('%d', i));
		// 		}
		// 	};
	
		// 	connection.query(`UPDATE lenses SET mirrored=1 WHERE unlockable_id='${unlockable_id}'`)
		// 	setTimeout(function () { backupImages(); }, 300);
		// });

};

async function getSnapRequest(path) {
	const response = await fetch(`https://studio-app.snapchat.com${path}`, {method: 'GET', headers});
	if (response.status !== 200) return {};
	let data;
	try {
		data = await response.json();
	} catch (e) {
		return {}
	}
	return data;
}

async function postSnapRequest(path, body) {
	const response = await fetch(`https://studio-app.snapchat.com${path}`, {method: 'POST', body: JSON.stringify(body), headers});
	if (response.status !== 200) return {};
	let data;
	try {
		data = await response.json();
	} catch (e) {
		return {}
	}
	return data;
}

async function postSnapDeeplink(body) {
	//this is used because we're forcing a deeplink_search on their servers when we detect certain URLs
	const response = await fetch(`https://studio-app.snapchat.com/vc/v1/explorer/deeplink_search`, {method: 'POST', body: JSON.stringify(body), headers});
	if (response.status !== 200) return {};
	let data;
	try {
		data = await response.json();
	} catch (e) {
		return {}
	}
	return data;
}

function selfBackup(unlockable_id) {
	fetch(`https://${backupDomain}/vc/v1/explorer/unlock?uid=${unlockable_id}`, {method: 'GET', headers}); 
};


export { backupImages, saveLens, savePNG, savePreviews, getSnapRequest, postSnapRequest, postSnapDeeplink, selfBackup};