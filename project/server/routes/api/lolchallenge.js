let router = require("express").Router();
let mongoose = require("mongoose");

let faker = require("faker");
let auth = require("../auth");
const { silver } = require('../../utilities/todaySilverPrice');
const moment = require('moment');

const { external_api_url } = require("../../config");
let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");
const { default: axios } = require("axios");

const lolChallengeSubmission = require('./lolChallengeSubmission');
const LOLChallenge = mongoose.model('LOLChallenge');
const calculateLaplata = require('../../utilities/calculateLaplata');
const Game = mongoose.model('Game');
const User = mongoose.model('User');
const Withdrawal = mongoose.model('Withdraw');
const SiteSettings = mongoose.model('LaplataSetting');



router.get('/', auth.required, auth.user, async (req, res, next) => {
  try {
    const user_id = req.user._id;
    const challenge = await LOLChallenge.findOne({ user: user_id, isFinished: false }).sort({ createdAt: -1 });
    //console.log("Challenge in database : fetch from apiservice fetchrunning challenge", challenge);
    return next(new OkResponse(challenge));
  } catch (error) {
    console.error(error);
    return next(new BadRequestResponse());
  }
});

router.post('/checkEngageStatus', auth.required, auth.user, async (req, res, next) => {
  try {
    console.log("REQ######", req.body)
    const user_id = req.user._id;
    const clientId = req.body.username;
    const region = req.body.region;
    const challenge = await LOLChallenge.find({ clientId: clientId, region: region, isFinished: false }).count();
    console.log("Challenge in database : fetch from apiservice fetchrunning challenge", challenge);
    return next(new OkResponse({ challenge: challenge }));
  } catch (error) {
    console.error(error);
    return next(new BadRequestResponse());
  }
});


//createNewChallenge service
router.post("/createNewChallenge", auth.required, auth.user, async function (req, res, next) {

  try {
    const now = moment().unix() * 1000;

    const challenge = new LOLChallenge({
      user: req.user._id,
      clientId: req.body.username,
      region: req.body.region,
      gameStatistics: {
        startTime: now,
        endTime: moment(now).add(6, 'h')
      }

    });
    try {
      await challenge.save();
    } catch (e) {
      console.error("Error while Creating a Challenge", e);
      return next(new BadRequestResponse("Server Error"));
    }

    return next(new OkResponse())
  } catch (error) {
    console.error(error);
    return next(new BadRequestResponse());
  }

});


router.get("/getlaplata", async function (req, res, next) {
  try {
    const ls = await SiteSettings.find();
    return next(new OkResponse(ls))
  } catch (error) {
    console.error(error);
    return next(new BadRequestResponse());
  }
});


router.post("/getGameData", auth.required, auth.user, async function (req, res, next) {

  try {
    const now = moment().unix() * 1000;
    const returnData = await axios.get(`${external_api_url}load_username?username=${encodeURIComponent(req.body.username)}&region=${encodeURIComponent(req.body.region)}&minutes=${encodeURIComponent(req.body.minutes)}`);

    return next(new OkResponse(returnData.data.data))
  } catch (error) {
    console.error(error);
    return next(new BadRequestResponse());
  }
  // let options = {
  //   page: 1,
  //   limit: 8,
  //   sort: {
  //     createdAt: -1,
  //   },
  // };

  // let query = { status: 2 };
  // let ongoing = await Tournament.paginate(query, options);

  // query.status = 3;
  // let past = await Tournament.paginate(query, options);

  // query.status = 1;
  // options = {
  //   page: req.body.page || 1,
  //   limit: req.body.limit || 8,
  //   sort: {
  //     createdAt: -1,
  //   },
  // };
  // Tournament.paginate(query, options, function (err, result) {
  //   if (err) {
  //     next(new BadRequestResponse("Server Error"));
  //   }
  //   next(new OkResponse({ upcoming: result, ongoing: ongoing, past: past }));
  // });
});

// router.all('/submission', lolChallengeSubmission)

router.post('/submission/:id', auth.required, auth.user, async function (req, res, next) {
  let challenge = [];
  let user;

  try {
    challenge = await LOLChallenge.findById(req.params.id);
    user = await User.findById(req.user._id);
  } catch (e) {
    console.error("Error while finding challenge", e);
    next(new BadRequestResponse("Server Error"));
  }

  var victories = 0;
  try {
    console.log('I am in try block in  ending challenge ', req.body.games);
    req.body.games.forEach(element => {

      const game = new Game({
        ...element,
        gameType: element.GameType,
        gameDuration: element.GameLength,
        gameTimeStamp: (element.timestamp * 1000),
        user: req.user._id,
        lolId: req.body.clientId,
        lolChallenge: challenge._id,
      });
      try {
        if (element.result === 'Victory') {
          victories += 1;
        }
        console.log('in push', victories);
        game.save();
        challenge.games.push(game._id);
      } catch (e) {
        console.error("Error while saving Game", e);
        next(new BadRequestResponse("Server Error"));
      }
    });
  }
  catch (e) {
    console.error('not in try');
    return next(new BadRequestResponse('server error'))
  }

  try {
    console.log('games', victories);
    challenge.rewardedLaplata = await calculateLaplata.calculate(challenge.games.length, victories);
    user.laplataBalance += challenge.rewardedLaplata;
  } catch (e) {
    console.error("Error while calculating Laplata", e);
    return next(new BadRequestResponse("Server Error"));
  }


  try {
    challenge.isFinished = req.body.isFinished;
    challenge.gameStatistics = req.body.gameStatistics;
    await challenge.save();
    await user.save();
  } catch (e) {
    console.error("Error while saving Challenge", e);
    return next(new BadRequestResponse("Server Error"));
  }

  next(new OkResponse(challenge));
});

router.post('/emptysubmission/:id', auth.required, auth.user, async function (req, res, next) {
  let challenge = [];
  let user;

  try {
    challenge = await LOLChallenge.findById(req.params.id);
    user = await User.findById(req.user._id);
  } catch (e) {
    console.error("Error while finding challenge", e);
    next(new BadRequestResponse("Server Error"));
  }

  var victories = 0;
  try {
    console.log('games', victories);
    challenge.rewardedLaplata = await calculateLaplata.calculate(challenge.games.length, victories);
    user.laplataBalance += challenge.rewardedLaplata;
  } catch (e) {
    console.error("Error while calculating Laplata", e);
    return next(new BadRequestResponse("Server Error"));
  }

  try {
    challenge.isFinished = req.body.isFinished;
    challenge.gameStatistics = req.body.gameStatistics;
    await challenge.save();
    await user.save();
  } catch (e) {
    console.error("Error while saving Challenge", e);
    return next(new BadRequestResponse("Server Error"));
  }

  await LOLChallenge.findByIdAndDelete(req.params.id);
  next(new OkResponse(challenge));
});



router.get('/submission', auth.required, auth.user, async function (req, res, next) {
  const options = {
    page: req.query.page || 1,
    limit: req.query.limit || 10,
    sort: { 'createdAt': -1 },
    populate: ["games"]
  }
  try {
    const challenges = await LOLChallenge.paginate({ user: mongoose.Types.ObjectId(req.user._id), isFinished: true }, options);
    next(new OkResponse({ result: challenges }));
  } catch (e) {
    console.error("Error while getting challenges", e);
    return next(new BadRequestResponse("Server Error"));
  }
});

router.get("/statistics", auth.required, auth.user, async function (req, res, next) {
  try {

    const user = await User.findById(req.user._id);
    const withdraws = await Withdrawal.find({ user: mongoose.Types.ObjectId(req.user._id) }).lean(true);
    const challenges = await LOLChallenge.find({ user: mongoose.Types.ObjectId(req.user._id), isFinished: true }).lean(true);
    const challengesPlayed = challenges.length;
    // statistics.totalGamesPlayed = overallchallenges.reduce((total, challenge) => {
    //     return total + challenge.gameStatistics.total;
    //   }, 0);
    const gamesPlayed = challenges.reduce((total, element) => {
      return total + element.games.length;
    }, 0);
    const totalWithdrawals = withdraws.reduce((accumalator, element) => {
      return accumalator + element.amount;
    }, 0);
    const lastmonthWith = await LOLChallenge.find({
      user: mongoose.Types.ObjectId(req.user._id),
      createdAt: {
        $gte: moment().startOf('month'),
        $lte: moment().endOf('month')
      }
    }).lean(true);

    const lastMonthWithdrawals = lastmonthWith.reduce((accumalator, element) => {
      return accumalator + element.rewardedLaplata;
    }, 0);
    const lastWeekChallenges = await LOLChallenge.find({
      user: mongoose.Types.ObjectId(req.user._id),
      createdAt: {
        $lte: moment().subtract(1, 'day'),
        $gte: moment().subtract(8, 'day')
      }
    });
    const lastWeekEarnings = lastWeekChallenges.reduce((accumalator, element) => {
      console.log(accumalator);
      return accumalator + element.rewardedLaplata
    }, 0);
    result = {
      totalLaplataEarned: user.laplataBalance + user.laplataWithdrawn,
      withdrwan: user.laplataWithdrawn,
      availableForWithdrawal: user.laplataBalance,
      earnedLastMonth: lastMonthWithdrawals,
      averagePerday: lastMonthWithdrawals / 30,
      averageLastWeek: lastWeekEarnings / 7,
      silver: req.user.silver,
      challengesPlayed,
      gamesPlayed
    };
    return next(new OkResponse(result));
  } catch (e) {
    console.error("Error while calculating user LOL statistics: ", e);
    return next(new BadRequestResponse("Server Error"));
  }

});

router.get('/submission/:userId', auth.required, auth.user, async function (req, res, next) {
  const options = {
    page: req.query.page || 1,
    limit: req.query.limit || 10,
    sort: { 'createdAt': -1 },
    populate: ["games"]
  }
  try {
    const challenges = await LOLChallenge.paginate({ user: mongoose.Types.ObjectId(req.params.userId) }, options);
    next(new OkResponse({ result: challenges }));
  } catch (e) {
    console.error("Error while getting challenges", e);
    return next(new BadRequestResponse("Server Error"));
  }
});

router.get("/statistics/:userId", auth.required, auth.user, async function (req, res, next) {
  try {
    const userId = req.params.userId
    const user = await User.findById(userId);
    const withdraws = await Withdrawal.find({ user: mongoose.Types.ObjectId(userId) }).lean(true);
    const challenges = await LOLChallenge.find({ user: mongoose.Types.ObjectId(userId) }).lean(true);
    const challengesPlayed = challenges.length;
    const gamesPlayed = challenges.reduce((accumalator, element) => {
      if (challenges.games) {
        return accumalator + challenges.games.length;
      }
      else {
        return accumalator;
      }
    }, 0);
    const totalWithdrawals = withdraws.reduce((accumalator, element) => {
      return accumalator + element.amount;
    }, 0);
    const lastmonthWith = await Withdrawal.find({
      user: mongoose.Types.ObjectId(userId),
      createdAt: {
        $gte: moment().subtract(1, 'month').startOf('month'),
        $lte: moment().subtract(1, 'month').endOf('month')
      }
    }).lean(true);
    const lastMonthWithdrawals = lastmonthWith.reduce((accumalator, element) => {
      return accumalator + element.amount;
    }, 0);
    const lastWeekChallenges = await LOLChallenge.find({
      user: mongoose.Types.ObjectId(userId),
      createdAt: {
        $lte: moment().subtract(1, 'day'),
        $gte: moment().subtract(8, 'day')
      }
    });
    const lastWeekEarnings = lastWeekChallenges.reduce((accumalator, element) => {
      return accumalator + element.rewardedLaplata
    }, 0);
    result = {
      userId: userId,
      totalLaplataEarned: user.laplataBalance + totalWithdrawals,
      withdrwan: totalWithdrawals,
      availableForWithdrawal: user.laplataBalance,
      earnedLastMonth: lastMonthWithdrawals,
      averagePerday: lastMonthWithdrawals / 30,
      averageLastWeek: lastWeekEarnings / 7,
      silver: req.user.silver,
      challengesPlayed,
      gamesPlayed
    };
    return next(new OkResponse(result));
  } catch (e) {
    console.error("Error while calculating user statistics: ", e);
    return next(new BadRequestResponse("Server Error"));
  }

});
module.exports = router;
