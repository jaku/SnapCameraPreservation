import mysql from "mysql2";
import * as dotenv from 'dotenv';

import * as Util from './helper.js';

dotenv.config()

const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME
});

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
				Util.saveLens(lens_id, lens_url);
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
				resolve(results);
			} else {
				resolve();
			}
		})
	});
}
function getMultipleLenses(lenses) {
	return new Promise(resolve => {
		connection.query(`SELECT * FROM lenses WHERE unlockable_id IN (${connection.escape(lenses)});`, async function(err, results) {
			if ( results && results[0] ) {
				resolve(results);
			} else {
				resolve();
			}
		})
	});
}

function getSingleLens(lensID) {
	return new Promise(resolve => {
		connection.query(`SELECT * FROM lenses WHERE unlockable_id="${lensID}" LIMIT 1;`, async function(err, results) {
			if ( results && results[0] ) {
				resolve(results);
			} else {
				resolve();
			}
		})
	});
}

async function insertLens(lenses, report) {

	lenses.forEach(async function(lens, index) {

		let { unlockable_id, snapcode_url, user_display_name, lens_name, lens_status, deeplink, icon_url, thumbnail_media_url, 
		thumbnail_media_poster_url, standard_media_url, standard_media_poster_url, obfuscated_user_slug, image_sequence } = lens;

		if ( !image_sequence ) image_sequence = {};
		if ( !thumbnail_media_url ) thumbnail_media_url = "";
		if ( !thumbnail_media_poster_url ) thumbnail_media_poster_url = "";
		if ( !obfuscated_user_slug ) obfuscated_user_slug = "";
		if ( !standard_media_poster_url ) standard_media_poster_url = "";
		if ( !standard_media_url ) standard_media_url = "";
		
		//hits our own service on every unlockable ID to make sure it gets the additional details about the lens
		Util.selfBackup(unlockable_id);

		return new Promise(resolve => {
			connection.query(`INSERT INTO lenses (unlockable_id, snapcode_url, user_display_name, lens_name, lens_status, deeplink, icon_url, thumbnail_media_url, thumbnail_media_poster_url, standard_media_url, standard_media_poster_url, obfuscated_user_slug, image_sequence) VALUES 
				(${unlockable_id}, '${snapcode_url}', ${connection.escape(user_display_name)}, '${lens_name}', '${lens_status}', '${deeplink}', '${icon_url}', '${thumbnail_media_url}', 
				'${thumbnail_media_poster_url}', '${standard_media_url}', '${standard_media_poster_url}', '${obfuscated_user_slug}', '${JSON.stringify(image_sequence)}')`, function (err, results) {
					if (err && err.code !== "ER_DUP_ENTRY") {
						console.log(err, lens_name)

						if ( report ) { //if report argument is true, we will resave the PNGs/previews 
							Util.savePNG(icon_url); 
							Util.savePNG(snapcode_url);
							Util.savePreviews(thumbnail_media_poster_url);
							Util.savePreviews(standard_media_url);
							Util.savePreviews(standard_media_poster_url);

							if (image_sequence && image_sequence?.size) {
								let { url_pattern, size } = image_sequence;
								for (let i = 0; i < size; i++) {
		  							Util.savePreviews(url_pattern.replace('%d', i));
								}
							};
						};

					} 
					if ( !err) {

						Util.savePNG(icon_url); 
						Util.savePNG(snapcode_url);
						Util.savePreviews(thumbnail_media_poster_url);
						Util.savePreviews(standard_media_url);
						Util.savePreviews(standard_media_poster_url);

						//this is frames of the video as jpg, so we need to back up each frame...
						if (image_sequence && image_sequence?.size) {
							let { url_pattern, size } = image_sequence;
							for (let i = 0; i < size; i++) {
	  							Util.savePreviews(url_pattern.replace('%d', i));
							}
						};
						connection.query(`UPDATE lenses SET mirrored=1 WHERE unlockable_id='${unlockable_id}'`)

					}
				});
		});

	});

};

export { getSingleLens, getMultipleLenses, lensSearch, updateLens, insertUnlock, insertLens };