let router = require('express').Router();
let mongoose = require('mongoose');
let Match = mongoose.model('Match');
let User = mongoose.model('User');
let auth = require('../auth');
let faker = require("faker");
let { OkResponse, BadRequestResponse, UnauthorizedResponse } = require('express-http-response');


// Preload article objects on routes with ':article'
router.param('match', function (req, res, next, id) {
    Match.findById(id)
        .then(function (match) {
            if (!match) { return next(new BadRequestResponse("No Match Found")); }
            req.match = match;
            return next();
        }).catch(next);
});
router.get('/friends/recently-played', auth.required, auth.user, function (req, res, next) {
    Promise.all([
        User.find({}).limit(10).exec(),
        User.find({ _id: { "$in": req.user.friends } }).exec()

    ]).then(function (results) {
        next(new OkResponse({ users: results[0], friends: results[1] }));

    }).catch(e => {});

});
router.post('/create', auth.required, auth.user, function (req, res, next) {
    if (!req.body.team || !req.body.type) {
        next(new ForbiddenResponse('Team or type not found', 422))
    } else {
        var teamA = req.body.team;
        const matchType = req.body.type;
        teamA.forEach(e => { if (e.player.username === req.user.username) { e.player = req.user; e.isCaptain = true; } });

        Promise.all([
            User.find({ _id: { $nin: req.user.friends } }).limit(5 + (5 - teamA.length)).exec(),
        ]).then(function (results) {
            let allPlayers = results[0]
            var teamB = [];
            for (let i = 0; i < 5; i++) {
                teamB[i] = { player: allPlayers[i], playerType: i + 1 };

            }
            if (allPlayers.length > 5) {
                for (let i = 5; i < allPlayers.length; i++) {
                    teamA[i] = { player: allPlayers[i], playerType: (i - 5) + 1 };

                }
            }
            var roomPassword = faker.random.number(99999999);
            var roomName = "LOLSilver" + faker.random.number(999999);

            new Match({ teamA, teamB, matchType, roomPassword, roomName }).save()

                .then(function (match) {
                    req.user.matches.push(match._id);
                    req.user.save().then(function (user) {
                        next(new OkResponse({ matchId: match._id }));
                    })
                })

        }).catch(e => {});
    }


});

// creates a new Match
router.post('/', function (req, res, next) {
    // User.findById(req.payload.id).then(function (user) {
    //     if (!user) { return res.sendStatus(401); }

    let match = new Match(req.body.match);

    // match.createdBy = user;

    return match.save().then(function () {
        next(new OkResponse({ match: match }));
        // return res.json({ match: match });
    }).catch(next);
    // }).catch(next);
});

// return a Match's Data
router.get('/:match', auth.optional, function (req, res, next) {
    Promise.all([
        // req.payload ? User.findById(req.payload.id) : null,
        req.match
            .populate('teamA.player')
            .populate('teamB.player')
            .execPopulate()
    ]).then(function (results) {
        // let user = results[0];
        
        next(new OkResponse({ match: req.match }));

    }).catch(next);
});


// update Match
router.put('/:match', auth.required, function (req, res, next) {

    if (typeof req.body.teamA !== 'undefined') {
        req.match.teamA = req.body.teamA;
    }

    if (typeof req.body.teamB !== 'undefined') {
        req.match.teamB = req.body.teamB;
    }

    if (typeof req.body.winnerTeam !== 'undefined') {
        if (req.body.winnerTeam == 1) { req.match.winnerTeam = req.match.teamA; }
        else { req.match.winnerTeam = req.match.teamB; }
        req.match.status = 2;
    }

    if (typeof req.body.status !== 'undefined') {
        req.match.status = req.body.status;
    }

    if (typeof req.body.tournamentParent !== 'undefined') {
        req.match.tournamentParent = req.body.tournamentParent;
    }

    if (typeof req.body.tournamentChild !== 'undefined') {
        req.match.tournamentChild = req.body.tournamentChild;
    }

    if (typeof req.body.entryFee !== 'undefined') {
        req.match.entryFee = req.body.entryFee;
    }

    if (typeof req.body.region !== 'undefined') {
        req.match.region = req.body.region
    }

    req.match.save().then(function (m) {
        next(new OkResponse({ match: m }));

        // return res.json({ match: match.toJSONFor(user) });
    }).catch(next);
    // } else {
    //     return res.sendStatus(403);
    // }
    // });
});

router.post('/my', auth.required, auth.user, async function (req, res, next) {
    const options = {
        page: req.body.page || 1,
        limit: req.body.limit || 10,
        sort: {
            createdAt: -1
        }
    }

    let query = {}
    query._id = req.user.matches;
    query.status = 2;

    if (req.body.query) {
        if (typeof req.body.query.type !== undefined && req.body.query.type && req.body.query.type !== 0 && req.body.query.type !== null) {
            query.matchType = { $in: req.body.query.type };
        }
    }

    Match.paginate(query, options, function (err, result) {
        if (err) { next(new BadRequestResponse("Server Error")) }
        next(new OkResponse({ result: result, _id: req.user._id }));
    });

});

module.exports = router;
