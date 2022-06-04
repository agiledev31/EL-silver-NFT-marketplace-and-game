let router = require("express").Router();
let mongoose = require("mongoose");
let Tournament = mongoose.model("Tournament");
let Match = mongoose.model('Match');
let User = mongoose.model("User");
let faker = require("faker");
let auth = require("../auth");
const {silver} = require('../../utilities/todaySilverPrice');

let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");
const { addTransaction } = require("../../utilities/transactions");
const { sendNotification } = require("../../utilities/notification");

// Preload tournament objects on routes with ':tournament'
router.param("tournament", function (req, res, next, id) {
  Tournament.findById(id)
    .then(function (tournament) {
      if (!tournament) {
        return next(new BadRequestResponse("No Tournament Found"));
      }
      req.tournament = tournament;
      return next();
    })
    .catch(next);
});

// return a Tournament's Data
router.get("/:tournament", function (req, res, next) {
  Promise.all([
    // req.payload ? User.findById(req.payload.id) : null,
    req.tournament.populate("matches").execPopulate(),
  ])
    .then(function (results) {
      next(new OkResponse({ tournament: req.tournament }));
    })
    .catch(next);
});

router.get("/invite/:tournament", auth.required, auth.user ,silver, async function (req, res, next) {
  req.tournament.teams.filter(team =>  team.players.some( (player) =>  {
    if(player.user.toString() == req.user._id.toString()) {
      player.entryFeeStatus = 1;
      return player;
    }
  }) )
  await addTransaction(req.user, req.tournament.entryFee, req.silver);
  req.tournament.save()
    .then(function (tournament) {
      next(new OkResponse({ tournament: tournament }));
    })
    .catch(next);
});

router.post("/join/:tournament",auth.required, auth.user ,silver, async function (req, res, next) {
    let team = {
        teamName: req.body.teamName,
        players: [
          {
            user: req.user._id,
            entryFeeStatus:  1 ,
          },
        ],
      }
      if(req.body.invites && req.body.invites.length > 0) {
          req.body.invites.forEach(playerId => {
              team.players.push({user: playerId, entryFeeStatus: 0})
              // emit to players to pay
              const tournamentInvite = playerId._id;
              lolSocket.emit('TournamentInvite'+tournamentInvite, {tournamentId: req.tournament._id, user: req.user});
              sendNotification({
                title: `${req.user.fullName} has invited you to a tournament`,
                type: 3,
                sentTo: playerId._id,
                user: req.user,
                data: {tournamentId: req.tournament._id}
              })

          });
      }
  req.tournament.teams.push(team);
  await addTransaction(req.user, req.tournament.entryFee, req.silver)
    req.tournament.save()
    .then(function (results) {
      lolSocket.emit('Tournament'+req.tournament._id);
      
      next(new OkResponse({ tournament: req.tournament }));
    })
    .catch(e => {
      next(new BadRequestResponse(e));

    });
});
// returns list of all tournaments
// used on tournament listing page on client side
router.post("/all", async function (req, res, next) {
  let options = {
    page: 1,
    limit: 8,
    sort: {
      createdAt: -1,
    },
  };

  let query = { status: 2 };
  let ongoing = await Tournament.paginate(query, options);

  query.status = 3;
  let past = await Tournament.paginate(query, options);

  query.status = 1;
  options = {
    page: req.body.page || 1,
    limit: req.body.limit || 8,
    sort: {
      createdAt: -1,
    },
  };
  Tournament.paginate(query, options, function (err, result) {
    if (err) {
      next(new BadRequestResponse("Server Error"));
    }
    next(new OkResponse({ upcoming: result, ongoing: ongoing, past: past }));
  });
});

// returns list of all tournaments
// used on tournament listing page on client side for search Tournament
router.post("/search", function (req, res, next) {
  const options = {
    page: req.body.page || 1,
    limit: req.body.limit || 8,
    sort: {
      createdAt: -1,
    },
  };

  let query = {};

  // query.status = 1;

  if (req.body.query) {
    if (req.body.query.searchQuery !== null && req.body.query.searchQuery) {
      query.name = { $regex: req.body.query.searchQuery, $options: "i" };
    }
  }

  Tournament.paginate(query, options, function (err, result) {
    if (err) {
      next(new BadRequestResponse("Server Error"));
    }
    next(new OkResponse(result));
  });
});
router.get("/test/create-matches/:tournament", async function (req, res, next) {
  // turn  all team members to paid
  req.tournament.teams.forEach((team, index, arr) => {
    team.players.forEach(player => {player.entryFeeStatus = 1;})
  });
let teams = req.tournament.teams;
  // now create games and matches
  for (let index = 0; index < teams.length / 2; index++) {

    // create a match here
    let teamA = teams[index].players.map((player , index)=> { 
      return {player: player.user, isCaptain : index === 0 }
    });
    let teamB = teams[index + 1].players.map((player , index)=> { 
      return {player: player.user, isCaptain : index === 0 }
    });
    var roomPassword = faker.random.number(99999999);
    var roomName = "LOLSilver" + faker.random.number(999999);

    let match = await new Match({ teamA, teamB, matchType : 3, roomPassword, roomName }).save();
    req.tournament.games.push({match: match._id , level: 0});
  }
  // send the notification about lobby link
  req.tournament.save().then(t => {
    next(new OkResponse({tournament: t}));
  })
  
  
   
});
var zlib = require('zlib');
router.get("/test/compress/:tournament",  function (req, res, next) {
 
  // console.log(Buffer.from().toString('base64'));
  console.log(Buffer.from(req.tournament._id.toString(), 'base64').toString('ascii'));
      next(new OkResponse({tournament: req.tournament}));
    
  
    // inflate() decompress
  
    // deflate() compress
});



module.exports = router;
