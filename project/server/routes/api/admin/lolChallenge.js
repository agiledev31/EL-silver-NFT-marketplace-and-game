const router = require("express").Router();
const {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");
const mongoose = require("mongoose");
const moment = require("moment");

const auth = require("../../auth");

const Game = mongoose.model("Game");
const LOLChallenge = mongoose.model("LOLChallenge");
const LaplataSettings = mongoose.model("LaplataSetting");
const User = mongoose.model("User");

// Get all challenges - paginated + get stastics on every single call.
router.get("/", async function (req, res, next) {
  const date = moment();
  console.log("req12344555666", req.query)

  let mysort = 'desc';
  let timequery = {};

  if (req.query.sortstatus) {
    mysort = req.query.sortstatus == 1 ? 'asc' : 'desc'
  }

  if (req.query.time) {
    if (req.query.time == -1) {
      timequery.createdAt = {
        $gte: moment().startOf('day'),
        $lte: moment().endOf('day')
      }
    }
    else if (req.query.time == 1) {
      timequery.createdAt = {
        $gte: moment().startOf('week'),
        $lte: moment().endOf('week')
      }
    }
    else if (req.query.time == 2) {
      timequery.createdAt = {
        $gte: moment().startOf('month'),
        $lte: moment().endOf('month')
      }
    }
  }

  const options = {
    page: req.query.page || 1,
    limit: req.query.limit || 10,
    sort: { createdAt: mysort },
    populate: ["games", "user"],
  };
  try {
    let statistics = {};
    if (options.page == 1) {

      const overallchallenges = await LOLChallenge.find({});
      const totalminers = await User.count({})

      let challenges = await LOLChallenge.find({
        createdAt: {
          $gte: moment().startOf('day'),
          $lte: moment().endOf('day')
        }
      });

      statistics.totalChallenges = overallchallenges.length;

      statistics.totalDailyChallenges = challenges.length;

      statistics.totalGamesPlayed = overallchallenges.reduce((total, challenge) => {
        return total + challenge.gameStatistics.total;
      }, 0);

      statistics.totalDailyGamesPlayed = challenges.reduce((total, challenge) => {
        return total + challenge.gameStatistics.total;
      }, 0);

      statistics.releasedLaplata = overallchallenges.reduce((total, challenge) => {
        return total + challenge.rewardedLaplata;
      }, 0);

      statistics.ongoingChallenges = await LOLChallenge.find({ isFinished: false }).count();

      statistics.totalminers = totalminers;

    }

    //console.log("statistics", statistics);
    const challenges = await LOLChallenge.paginate(timequery, options);
    next(new OkResponse({ result: challenges, statistics: statistics }));
  } catch (e) {
    console.error("Error while getting challenges", e);
    return next(new BadRequestResponse("Server Error"));
  }
});



router.get("/search/:query", auth.required, auth.admin, async (req, res, next) => {
  const query = {
    fullName: {
      $regex: new RegExp(`.*${req.params.query}.*`, 'igm')
    }
  };
  const options = {
    page: req.query.page || 1,
    limit: req.query.limit || 10,
    sort: { createdAt: -1 },
    populate: ["games", "user"],
  };
  try {
    const userIds = await User.find(query).select("_id").lean(true);
    console.log(userIds);
    const results = await LOLChallenge.paginate({ user: { $in: userIds } }, options);
    return next(new OkResponse(results));
  } catch (e) {
    console.error("Error while searching", e);
    return next(new BadRequestResponse("Server Error"));
  }


})
// Update Laplata Settings
router.put(
  "/laplata-settings",
  auth.required,
  auth.admin,
  async function (req, res, next) {
    try {
      const newSettings = await LaplataSettings.findOneAndUpdate({}, req.body, {
        new: true,
      })
        .select("perDayDistribution hardCap incentive minwithdrawal -_id")
        .lean(true);
      next(new OkResponse({ settings: newSettings }));
    } catch (e) {
      console.error("Error while setting Laplata Settings", e);
      return next(new BadRequestResponse("Server Error"));
    }
  }
);

// Get current laplata Settings
router.get(
  "/laplata-settings",
  auth.required,
  auth.admin,
  async function (req, res, next) {
    try {
      const settings = await LaplataSettings.findOne()
        .select("perDayDistribution hardCap incentive minwithdrawal -_id")
        .lean(true);
      console.log(settings);
      next(new OkResponse({ settings }));
    } catch (e) {
      console.error("Error while getting Laplata Settings ", e);
      return next(new BadRequestResponse("Server Error"));
    }
  }
);

// Get challenges for a user
router.post(
  "/:userId",
  auth.required,
  auth.admin,
  async function (req, res, next) {
    const options = {
      page: req.body.qparams.page || 1,
      limit: req.body.qparams.limit || 10,
      sort: { createdAt: -1 },
      populate: ["user", "games"],
    };
    try {
      const challenges = await LOLChallenge.paginate(
        { user: mongoose.Types.ObjectId(req.params.userId) },
        options
      );
 
      next(new OkResponse({ result: challenges}));
    } catch (e) {
      console.error("Error while getting challenges", e);
      return next(new BadRequestResponse("Server Error"));
    }
  }
);

router.get("/statistics/:userId/", auth.required, auth.admin, async (req, rest, next) => {
  try {
    const statistics = {
      totalChallenges: 0,
      averageKDA: 0,
      totalGames: 0,
      victories: 0,
      defeats: 0,
      totalLaplata: 0,
    };

    const challenges = await LOLChallenge.find({
      user: mongoose.Types.ObjectId(req.params.userId),
    }).lean(true);

    console.log("#########",challenges);

    statistics.totalChallenges = challenges.length;

    statistics.totalLaplata = challenges.reduce((accumlator, element) => {
      return accumlator + element.rewardedLaplata;
    }, 0);

    statistics.totalGames = challenges.reduce((accumlator, element) => {
      return accumlator + element.gameStatistics.total;
    }, 0);

    statistics.victories = challenges.reduce((accumlator, element) => {
      return accumlator + element.gameStatistics.victories;
    }, 0);

    statistics.defeats = challenges.reduce((accumlator, element) => {
      return accumlator + element.gameStatistics.defeats;
    }, 0);

    const totalKDA = challenges.reduce((accumlator, element) => {
      return accumlator + element.gameStatistics.averageKDA
    }, 0);

    if (totalKDA > 0)
      statistics.averageKDA = totalKDA / challenges.length;
    else
      statistics.averageKDA = 0;
    return next(new OkResponse(statistics));
  } catch (e) {
    console.error("Error while calculating Statistics ", e);
    return next(new BadRequestResponse("Server Error"));
  }

})
// Get challenge by challenge id.
router.get(
  "/:challengeId",
  auth.required,
  auth.admin,
  async function (req, res, next) {
    try {
      const challenges = await LOLChallenge.findById(req.params.challengeId);
      next(new OkResponse({ result: challenges }));
    } catch (e) {
      console.error("Error while getting challenges", e);
      return next(new BadRequestResponse("Server Error"));
    }
  }
);

module.exports = router;
