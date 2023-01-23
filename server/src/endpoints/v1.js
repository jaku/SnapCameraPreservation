import express from 'express'

var router = express.Router();

//have seen requests for this endpoint but looks like it's not getting anything from the server
//running this just incase its used for something down the line
router.get('/', async function(req, res, next) {
	res.json({});
});

export default router;