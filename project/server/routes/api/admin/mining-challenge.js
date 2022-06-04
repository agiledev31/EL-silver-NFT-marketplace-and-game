let router = require('express').Router();
let mongoose = require('mongoose');
let Series = mongoose.model('Series');
let User = mongoose.model('User');
let { OkResponse, BadRequestResponse, UnauthorizedResponse } = require('express-http-response');


// Preload challenge objects on routes with ':challenge'
router.param('challenge', function (req, res, next, id) {
    Series.findById(id)
        .then(function (challenge) {
            if (!challenge) { return next(new BadRequestResponse("No challenge Found")); }
            req.challenge = challenge;
            return next();
        }).catch(next);
});

// creates a new Challenge
router.post('/', function (req, res, next) {

    let series = new Series(req.body.challenge);
    return series.save().then(function (series) {
        next(new OkResponse({ tournamentID: series._id }));

    }).catch(next);
});


router.post('/all', function (req, res, next) {
    const options = {
        // page: req.body.page || 1,
        // limit: req.body.limit || 10,
        sort: {
            createdAt: -1
        }
    }

    let query = {}
    Series.paginate(query, options, function (err, result) {
        if (err) { next(new BadRequestResponse("Server Error")) }
        next(new OkResponse(result));
    });

});


// router.get('/:level', function (req, res, next) {
//     Promise.all([
//         // req.payload ? User.findById(req.payload.id) : null,
//         // req.level.execPopulate()
//     ]).then(function (results) {

//         next(new OkResponse({ level: req.level }));
//     }).catch(next);
// });

// deletes a level
router.delete('/:challenge', function (req, res, next) {

    // return req.article.remove().then(function () {
    //     return res.sendStatus(204);
    // });
    Promise.all([
        req.challenge.remove()
    ]).then(function (results) {
        next(new OkResponse("challenge deleted"));
    }).catch(next);
});



// update challenge
router.put('/:challenge', function (req, res, next) {

    if (typeof req.body.name !== 'undefined') {
        req.challenge.name = req.body.name;
    }

    if (typeof req.body.startDate !== 'undefined') {
        req.challenge.startDate = req.body.startDate;
    }

    if (typeof req.body.endDate !== 'undefined') {
        req.challenge.endDate = req.body.endDate;
    }

    if (typeof req.body.poolprize !== 'undefined') {
        req.challenge.poolprize = req.body.poolprize;
    }
    
    if (typeof req.body.prizedistribution !== 'undefined') {
        req.challenge.prizedistribution = req.body.prizedistribution;
    }

    req.challenge.save().then(function (l) {
        next(new OkResponse({ challenge: l }));
    }).catch(next);
});


module.exports = router;
