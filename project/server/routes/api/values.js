let router = require('express').Router();
let httpResponse = require('express-http-response');
 
let OkResponse = httpResponse.OkResponse;
router.get('/', function(req, res, next){
    next(new OkResponse({message: req.polyglot.t('values')}));
});


module.exports = router;
