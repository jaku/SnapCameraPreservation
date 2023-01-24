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
const isRelay = process.env.RELAY;

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

async function selfBackup(unlockable_id) {
	const data = await getSnapRequest(`/vc/v1/explorer/unlock?uid=${unlockable_id}`);
	if ( data && data['lens_id'] ) DB.insertUnlock(data);
};

//replaces any javascript object we pass it that has some of the original URLs and replaces them with our s3Bucket URL
function modifyResponseURLs(orgResponse) {
	orgResponse = JSON.stringify(orgResponse);
	return JSON.parse(orgResponse.replaceAll(/snapcodes.storage.googleapis.com|storage.googleapis.com|lens-storage.storage.googleapis.com|community-lens.storage.googleapis.com/gi, s3URL));
};

function getS3Bucket() {
	return s3Bucket;
};

function getS3URL() {
	return s3URL;
};

function relay() {
	if (isRelay.toLowerCase() === "false" ) {
		return false;
	} else {
		return true;
	};
};

export { saveLens, savePNG, savePreviews, getSnapRequest, postSnapRequest, postSnapDeeplink, selfBackup, modifyResponseURLs, getS3Bucket, getS3URL, relay};