let router = require('express').Router();
let mongoose = require('mongoose');
let Level = mongoose.model('Level');
let User = mongoose.model('User');
let { OkResponse, BadRequestResponse, UnauthorizedResponse } = require('express-http-response');


// Preload level objects on routes with ':level'
router.param('level', function (req, res, next, id) {
    Level.findById(id)
        .then(function (level) {
            if (!level) { return next(new BadRequestResponse("No Level Found")); }
            req.level = level;
            return next();
        }).catch(next);
});

// creates a new Level
router.post('/', function (req, res, next) {
    let level = new Level(req.body.level);
    level.createdBy = req.user._id;

    return level.save().then(function (level) {
        next(new OkResponse({ tournamentID: level._id }));

        // req.user.tournaments.push(level._id);
        // req.user.save().then(function (user) {
        //     next(new OkResponse({ tournamentID: level._id }));
        // })
    }).catch(next);
});

// return a Level's Data
router.get('/:level', function (req, res, next) {
    Promise.all([
        // req.payload ? User.findById(req.payload.id) : null,
        // req.level.execPopulate()
    ]).then(function (results) {
        
        next(new OkResponse({ level: req.level }));
    }).catch(next);
});

// deletes a level
router.delete('/:level', function (req, res, next) {

    // return req.article.remove().then(function () {
    //     return res.sendStatus(204);
    // });
    Promise.all([
        req.level.remove()
    ]).then(function (results) {
        next(new OkResponse("level deleted"));
    }).catch(next);
});

router.post('/all', function (req, res, next) {
    const options = {
        // page: req.body.page || 1,
        // limit: req.body.limit || 10,
        sort: {
            minPoints: 1
        }
    }


    let query = {}
    // if (req.body.query) {
    //     if (typeof req.body.query.status !== undefined && req.body.query.status && req.body.query.status !== -1 && req.body.query.status !== null) {
    //         query.status = { $in: req.body.query.status };
    //     }
    //     if (req.body.query.searchQuery !== null && req.body.query.searchQuery) {
    //         query.name = { $regex: req.body.query.searchQuery, $options: 'i' };
    //     }
    // }

    Level.paginate(query, options, function (err, result) {
        if (err) { next(new BadRequestResponse("Server Error")) }
        next(new OkResponse(result));
    });

});


// update level
router.put('/:level', function (req, res, next) {

    if (typeof req.body.name !== 'undefined') {
        req.level.name = req.body.name;
    }

    if (typeof req.body.minPoints !== 'undefined') {
        req.level.minPoints = req.body.minPoints;
    }

    if (typeof req.body.commissionRate !== 'undefined') {
        req.level.commissionRate = req.body.commissionRate;
    }

    req.level.save().then(function (l) {
        next(new OkResponse({ level: l }));
    }).catch(next);
});


module.exports = router;
