let router = require('express').Router();
let auth = require("../../auth");

router.use('/', require('./users'));
router.use('/user-management', auth.required, auth.admin, require('./user-management'));
router.use('/tournament-management', auth.required, auth.admin, require('./tournament'));
router.use('/level-management', auth.required, auth.admin, require('./level-management'));
router.use('/mining-challenge', auth.required, auth.admin, require('./mining-challenge'));
router.use('/setting-management', auth.required, auth.admin, require('./siteSetting'));
router.use('/voucher', auth.required, auth.admin, require('./voucher'));
router.use('/announcement',  require('./announcement'));
router.use('/trade', auth.required, auth.admin, require('./trade'));
router.use('/lol-challenge', require('./lolChallenge'));
router.use('/withdraws', require('./withdraw'));


module.exports = router;