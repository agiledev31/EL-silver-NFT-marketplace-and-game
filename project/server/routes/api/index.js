let router = require('express').Router();

router.use('/', require('./users'));
router.use('/admin', require('./admin'));

router.use('/values', require('./values'));
router.use('/constants', require('./constants'));
router.use('/chat', require('./chat'));
router.use('/match', require('./match'));
router.use('/tournament', require('./tournament'));
router.use('/trade/silver', require('./systemTrade'));
router.use('/notification', require('./notification'));
router.use('/lolchallenge', require('./lolchallenge'));
router.use('/withdraw', require('./withdraw'));
router.use('/leaderboard', require('./leaderboard'));

router.use('/matchFinding', require('./matchMaking'));

router.use('/upload', require('./upload'));


module.exports = router;