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
const s3Replace = process.env.S3REPLACE;

const snapHeaders = {
	'X-Installation-Id': 'default'
};
const headers = new Headers(snapHeaders);

//https://stackoverflow.com/questions/14867835/get-substring-between-two-characters-using-javascript
//Credits to https://stackoverflow.com/users/1620543/alex-c
var getFromBetween = {
    results:[],
    string:"",
    getFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var SP = this.string.indexOf(sub1)+sub1.length;
        var string1 = this.string.substr(0,SP);
        var string2 = this.string.substr(SP);
        var TP = string1.length + string2.indexOf(sub2);
        return this.string.substring(SP,TP);
    },
    removeFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var removal = sub1+this.getFromBetween(sub1,sub2)+sub2;
        this.string = this.string.replace(removal,"");
    },
    getAllResults:function (sub1,sub2) {
        // first check to see if we do have both substrings
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

        // find one result
        var result = this.getFromBetween(sub1,sub2);
        // push it to the results array
        this.results.push(result);
        // remove the most recently found one from the string
        this.removeFromBetween(sub1,sub2);

        // if there's more substrings
        if(this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
            this.getAllResults(sub1,sub2);
        }
        else return;
    },
    get:function (string,sub1,sub2) {
        this.results = [];
        this.string = string;
        this.getAllResults(sub1,sub2);
        return this.results;
    }
};

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
	if(!replaceS3()) return orgResponse;
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

function replaceS3() {
	if (s3Replace.toLowerCase() === "false" ) {
		return false;
	} else {
		return true;
	};
};

export { getFromBetween, saveLens, savePNG, savePreviews, getSnapRequest, postSnapRequest, postSnapDeeplink, selfBackup, modifyResponseURLs, getS3Bucket, getS3URL, relay, replaceS3};