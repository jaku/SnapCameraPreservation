
import express from 'express'

var router = express.Router();

router.get('/', async function(req, res, next) {

	res.json({
		"version": "1.21.0",
		"notes": "What's new:\r\n- Nothing. Jaku Server."
	})

});




export default router;