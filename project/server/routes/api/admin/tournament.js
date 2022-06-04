let router = require('express').Router();
let mongoose = require('mongoose');
let Tournament = mongoose.model('Tournament');
let User = mongoose.model('User');
let faker = require("faker");
let { OkResponse, BadRequestResponse, UnauthorizedResponse } = require('express-http-response');


// Preload tournament objects on routes with ':tournament'
router.param('tournament', function (req, res, next, id) {
    Tournament.findById(id)
        .then(function (tournament) {
            if (!tournament) { return next(new BadRequestResponse("No Tournament Found")); }
            req.tournament = tournament;
            return next();
        }).catch(next);
});

// creates a new Tournament
router.post('/', function (req, res, next) {
    let tournament = new Tournament(req.body.tournament);
    tournament.createdBy = req.user._id;

    return tournament.save().then(function (tournament) {
        next(new OkResponse({ tournamentID: tournament._id }));

        // req.user.tournaments.push(tournament._id);
        // req.user.save().then(function (user) {
        //     next(new OkResponse({ tournamentID: tournament._id }));
        // })
    }).catch(next);
});

// return a Tournament's Data
router.get('/:tournament', function (req, res, next) {
    Promise.all([
        // req.payload ? User.findById(req.payload.id) : null,
        req.tournament
            .populate('matches')
            .execPopulate()
    ]).then(function (results) {
        
        next(new OkResponse({ tournament: req.tournament }));

    }).catch(next);
});

router.post('/all', function (req, res, next) {
    const options = {
        page: req.body.page || 1,
        limit: req.body.limit || 10,
        sort: {
            createdAt: -1
        }
    }


    let query = {}
    // query._id = req.user.tournaments;

    if (req.body.query) {
        if (typeof req.body.query.status !== undefined && req.body.query.status && req.body.query.status !== -1 && req.body.query.status !== null) {
            query.status = { $in: req.body.query.status };
        }
        if (req.body.query.searchQuery !== null && req.body.query.searchQuery) {
            query.name = { $regex: req.body.query.searchQuery, $options: 'i' };
        }
    }

    Tournament.paginate(query, options, function (err, result) {
        if (err) { next(new BadRequestResponse("Server Error")) }
        next(new OkResponse(result));
    });

});


// // update Match
// router.put('/:match', function (req, res, next) {

//     if (typeof req.body.teamA !== 'undefined') {
//         req.match.teamA = req.body.teamA;
//     }

//     if (typeof req.body.teamB !== 'undefined') {
//         req.match.teamB = req.body.teamB;
//     }

//     if (typeof req.body.winnerTeam !== 'undefined') {
//         if (req.body.winnerTeam == 1) { req.match.winnerTeam = req.match.teamA; }
//         else { req.match.winnerTeam = req.match.teamB; }
//         req.match.status = 2;
//     }

//     if (typeof req.body.status !== 'undefined') {
//         req.match.status = req.body.status;
//     }

//     if (typeof req.body.tournamentParent !== 'undefined') {
//         req.match.tournamentParent = req.body.tournamentParent;
//     }

//     if (typeof req.body.tournamentChild !== 'undefined') {
//         req.match.tournamentChild = req.body.tournamentChild;
//     }

//     if (typeof req.body.entryFee !== 'undefined') {
//         req.match.entryFee = req.body.entryFee;
//     }

//     if (typeof req.body.region !== 'undefined') {
//         req.match.region = req.body.region
//     }

//     req.match.save().then(function (m) {
//         next(new OkResponse({ match: m }));

//         // return res.json({ match: match.toJSONFor(user) });
//     }).catch(next);
//     // } else {
//     //     return res.sendStatus(403);
//     // }
//     // });
// });

// router.post('/my', async function (req, res, next) {
//     const options = {
//         page: req.body.page || 1,
//         limit: req.body.limit || 10,
//         sort: {
//             createdAt: -1
//         }
//     }

//     let query = {}
//     query._id = req.user.matches;
//     query.status = 2;

//     if (req.body.query) {
//         if (typeof req.body.query.type !== undefined && req.body.query.type && req.body.query.type !== 0 && req.body.query.type !== null) {
//             query.matchType = { $in: req.body.query.type };
//         }
//     }

//     Match.paginate(query, options, function (err, result) {
//         if (err) { next(new BadRequestResponse("Server Error")) }
//         next(new OkResponse({ result: result, _id: req.user._id }));
//     });

// });

module.exports = router;
