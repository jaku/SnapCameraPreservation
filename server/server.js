import * as dotenv from 'dotenv';
import express from "express";

import lenses from './src/endpoints/lenses.js';
import categorylenses from './src/endpoints/categorylenses.js';
import top from './src/endpoints/top.js';
import unlock from './src/endpoints/unlock.js';
import categories from './src/endpoints/categories.js';
import scheduled from './src/endpoints/scheduled.js';
import search from './src/endpoints/search.js';
import deeplink from './src/endpoints/deeplink.js';
import reporting from './src/endpoints/reporting.js';
import latest from './src/endpoints/latest.js';
import download from './src/endpoints/download.js';
import v1 from './src/endpoints/v1.js';
import wildcard from './src/endpoints/wildcard.js';

dotenv.config()
const serverPort = process.env.PORT;
const app = express();

app.use(express.json());
app.use(/vc/v1/explorer/lenses, lenses);
app.use('/vc/v1/explorer/category/lenses', categorylenses);
app.use('/vc/v1/explorer/top', top);
app.use('/vc/v1/explorer/unlock', unlock);
app.use('/vc/v1/explorer/categories', categories);
app.use('/vc/v1/explorer/scheduled', scheduled);
app.use('/vc/v1/explorer/search', search);
app.use('/vc/v1/explorer/deeplink_search', deeplink);
app.use('/vc/v1/reporting/lens', reporting);
app.use('/vc/v1/update/latest', latest);
app.use('/vc/v1/update/download', download);
app.use('/vc/v1', v1);
app.use('*', wildcard); //any endpoints were not sure about we log

app.listen(serverPort, () => {
	console.log(`Snap Chat Backup is running on port ${serverPort}`);
});