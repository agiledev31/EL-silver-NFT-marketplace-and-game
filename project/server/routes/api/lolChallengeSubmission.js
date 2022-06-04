const router = require('express').Router();
const {
    OkResponse,
    BadRequestResponse,
    UnauthorizedResponse,
  } = require("express-http-response");
const mongoose = require("mongoose");

const auth = require("../auth");
const calculateLaplata = require('../../utilities/calculateLaplata');

const Game = mongoose.model('Game');
const LOLChallenge = mongoose.model('LOLChallenge');

router.post('/', auth.required, auth.user, async function(req,res,next) {
    const challenge = new LOLChallenge({
        user: req.user._id,
        clientId: req.body.clientId,
        gameStatistics: req.body.gameStatistics
    });
    // Create Games
    req.body.games.forEach(async element => {
        const game = new Game({
            ...element, 
            user: req.user._id,
            lolId: req.body.clientId,
            lolChallenge: challenge._id
        });
        try {
            await game.save();
            challenge.games.push(game._id);
        } catch(e) {
            console.error("Error while saving Game", e);
            throw e;
        }
    });
    try {
        challenge.rewardedLaplata = await calculateLaplata.calculate(challenge.games.length);
    } catch (e) {
        console.error("Error while calculating Laplata", e);
        return next(new BadRequestResponse("Server Error"));
    }
    try {
        await challenge.save();
    } catch(e) {
        console.error("Error while saving Challenge", e);
        return next(new BadRequestResponse("Server Error"));
    }
    next(new OkResponse(challenge));
});

router.get('/', auth.required, auth.user, async function(req,res,next) { 
    const options = {
        page: req.query.page || 1,
        limit: req.query.page || 10,
        sort: {'createdAt': -1},
    }
    try {
        const challenges = await LOLChallenge.paginate({user: mongoose.Types.ObjectId(req.user._id)}, options);
        next(new OkResponse({result: challenges}));
    } catch (e) {
        console.error("Error while getting challenges", e);
        return next(new BadRequestResponse("Server Error"));
    }
});


module.exports = router;