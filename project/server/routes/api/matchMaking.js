let router = require("express").Router();
let mongoose = require("mongoose");
let Match = mongoose.model("Match");
let SoloMatchRequest = mongoose.model("SoloMatchRequest");
let FiveV5MatchRequest = mongoose.model("FiveV5MatchRequest");
let User = mongoose.model("User");
let auth = require("../auth");
let faker = require("faker");
const { sendNotification } = require("../../utilities/notification");

let { emitEvent } = require("../../utilities/realTime");
let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");
// // Preload article objects on routes with ':article'
// router.param('article', function(req, res, next, slug) {
//     Article.findOne({ slug: slug})
//       .populate('author')
//       .then(function (article) {
//         if (!article) { return res.sendStatus(404); }

//         req.article = article;

//         return next();
//       }).catch(next);
//   });

router.get("/test/solo", function (req, res, next) {
  User.find({}).then(async (users) => {
    for (let index = 0; index < 9; index++) {
      const soloMatchRequest = new SoloMatchRequest({
        positions: [faker.random.number(5), faker.random.number(5)],
        user: users[index],
      });
      await soloMatchRequest.save();
    }

    next(new OkResponse({ message: "Ok Test now" }));
  });
});

router.get("/solo", auth.required, auth.user, function (req, res, next) {
  SoloMatchRequest.findOne({ user: req.user._id, status: 1 }).then(
    (soloRequest) => {
      next(new OkResponse({ soloRequest: soloRequest }));
    }
  );
});
router.get(
  "/solo/accept/:matchId",
  auth.required,
  auth.user,
  async function (req, res, next) {
    let match = await Match.findOne({ _id: req.params.matchId, status: 1 });

    let soloMatchFind = await SoloMatchRequest.findOne({
      user: req.user,
    });

    match.teamA = match.teamA ? match.teamA : [];
    match.teamB = match.teamB ? match.teamB : [];
    if (match.teamA && match.teamA.length <= 5) {
      match.teamA.push({
        player: req.user._id,
        playerType: soloMatchFind.positions[0],
      });
      match.teamA[0].isCaptain = true;
    } else if (match.teamB.length <= 5) {
      match.teamB.push({
        player: req.user._id,
        playerType: soloMatchFind.positions[0],
      });
      match.teamB[0].isCaptain = true;
    } else {
      return next(new BadRequestResponse("No Match Found"));
    }
    match.save(async function (err) {
      if (err) return next(new BadRequestResponse("No Match Found"));
      soloMatchFind.status = 2;
      await soloMatchFind.save();
      next(new OkResponse({ match: match }));
    });

    // get match by id add him in team
    // if teamA is full add in teamB if teamB is also full response back
    // and  latest request status will be 1
  }
);

router.post("/solo", auth.required, auth.user, async function (req, res, next) {
  let soloMatchFind = await SoloMatchRequest.findOne({
    user: req.user._id,
    status: 1,
  });
  if (!soloMatchFind) {
    soloMatchFind = new SoloMatchRequest({
      positions: req.body.positions,
      user: req.user,
    });
  }

  soloMatchFind
    .save()
    .then(async function (soloRequest) {
      const soloRequests = await SoloMatchRequest.find({ status: 1 });
      if (soloRequests.length >= 10) {
        const roomPassword = faker.random.number(99999999);
        const roomName = "LOLSilver" + faker.random.number(999999);
        const matchType = req.body.type;
        const teamA = [];
        const teamB = [];
        const match = await new Match({
          teamA,
          teamB,
          matchType,
          roomPassword,
          roomName,
        }).save();
        soloRequests.forEach((solo) => {
          console.log("solo.user", solo.user);
          emitEvent("SoloMatchFound", solo.user, { matchId: match._id });
        });
      }
      next(new OkResponse({ match: soloRequest }));
    })
    .catch((e) => console.error(e));
});

// 5v5 matches

router.post("/lobby/5v5", auth.required, auth.user, async function (req, res, next) {
  // save all other things
  // send the invites to all
  
  let fiveRequest = new FiveV5MatchRequest();
  fiveRequest.team = [{player: req.user, playerType: req.body.currentUserType, isCaptain: true}]
  fiveRequest.user = req.user;
  fiveRequest.map = req.body.map;
  fiveRequest.invites = req.body.invites;
  // send the invites
  
  fiveRequest.save().then(FiveV5Request => {
    FiveV5Request.invites.forEach(e => {
      emitEvent("5V5Invite", e, {matchRequestId: FiveV5Request._id, user: req.user});

      sendNotification({
        title: `${req.user.fullName} has invited you to a 5v5 Match`,
        type: 6,
        sentTo: e,
        user: req.user,
        data: {matchRequestId: FiveV5Request._id}
      })
    })
    next(new OkResponse({ match: FiveV5Request }));
  })
});
router.get("/lobby/5v5/:lobbyId", auth.required, auth.user,  function (req, res, next) {
  FiveV5MatchRequest.findById(req.params.lobbyId).populate('team.player').then(fiveRequest => {
    next(new OkResponse({ match: fiveRequest }));
  })
});
router.get("/invite/5v5/test/:inviteId", function (req, res, next) {
  // remove from invites and add to Team and save
  // refresh the event
  FiveV5MatchRequest.findById(req.params.inviteId).then(fiveRequest => {

    for (let index = 0; index <= 5 - fiveRequest.team.length; index++) {
      let invite = fiveRequest.invites.pop();
      fiveRequest.team.push({player: invite, playerType: -1})
    }

    
    emitEvent("5V5Lobby", fiveRequest._id , {});
    fiveRequest.save().then(five => {
      next(new OkResponse({ match: five }));
    })
  })
});
router.get("/invite/5v5/accept/:inviteId", auth.required, auth.user, async function (req, res, next) {
  // remove from invites and add to Team and save
  // refresh the event
  FiveV5MatchRequest.findById(req.params.inviteId).then(fiveRequest => {
    fiveRequest.invites = fiveRequest.invites.filter(invite => invite !== req.user._id )
    fiveRequest.team.push({player: req.user, playerType: 1})
    emitEvent("5V5Lobby", fiveRequest._id , {});
    fiveRequest.save().then(five => {
      next(new OkResponse({ match: five }));
    })
  })
});
router.put("/invite/5v5/:inviteId", auth.required, auth.user, async function (req, res, next) {
  FiveV5MatchRequest.findById(req.params.inviteId).then(fiveRequest => {

    newInvites = [];
    req.body.invites.forEach(invite => {
      if(fiveRequest.invites.findIndex(e => e._id === invite._id) === -1) {
        newInvites.push(invite);
      }
    })
    fiveRequest.invites = req.body.invites;
    fiveRequest.save().then(fiveReq => {
      next(new OkResponse({ match: fiveReq }));
    })
  })
  // save the invites  etc
  // send the new invites 

  
});

// on team Read
module.exports = router;
