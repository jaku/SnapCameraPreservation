
import express from 'express'

var router = express.Router();
//not sure if this is a GET or a POST actually. I see in the code it can request this URL but haven't been able to actually
//see it in action nor have I been able to get the functionality to work, howerver we certainly don't want it working so 
//this is setup to reply with nothing if it does actually get requested by the snap camera app.
router.get('/', async function(req, res, next) {
	res.json({});
});

router.post('/', async function(req, res, next) {
	res.json({});
});

export default router;