let router = require("express").Router();
let mongoose = require("mongoose");
let auth = require("../auth");
const moment = require("moment");
const OkResponse = require("express-http-response/lib/http/OkResponse");
const BadRequestResponse = require("express-http-response/lib/http/BadRequestResponse");
const User = mongoose.model("User");
const LOLChallenge = mongoose.model("LOLChallenge");

router.get("/", auth.required, auth.user, async (req, res, next) => {
  try {
    const users = await User.aggregate([
      {
        $addFields: {
          totalLaplataEarned: {
            $sum: ["$laplataBalance", "$laplataWithdrawn"],
          },
        },
      },
      {
        $sort: {
          totalLaplataEarned: -1,
        },
      },
      {
        $limit: 20,
      },
      {
        $project: {
          fullName: 1,
          totalLaplataEarned: 1,
          laplataWithdrawn: 1,
          laplataBalance: 1,
          username: 1,
        },
      },
    ]);

    const userIds = users.map((e) => e._id);
    const challenges = await LOLChallenge.aggregate([
      {
        $match: {
          user: {
            $in: userIds,
          },
        },
      },
      {
        $group: {
          _id: "$user",
          totalChallenges: {
            $sum: 1,
          },
          totalVictories: {
            $sum: "$gameStatistics.victories",
          },
          totalGames: {
            $sum: "$gameStatistics.total",
          },
          totalDefeats: {
            $sum: "$gameStatistics.defeats",
          },
        },
      },
      {
        $project: {
          _id: 1,
          totalGames: 1,
          totalChallenges: 1,
          totalVictories: 1,
          totalDefeats: 1,
          winRatio: {
            $multiply: [
              {
                $divide: ["$totalVictories", "$totalGames"],
              },
              100,
            ],
          },
        },
      },
    ]);
    // console.log('##################################',challenges.head());
    challenges.forEach((challenge) => {
      challenge._id = new mongoose.Types.ObjectId(challenge._id);
      const user = users.find((e) => {
        // console.log(challenge._id.equals(e._id));
        return challenge._id.equals(e._id);
      });
      if (user) {
        user.statistics = challenge;
      }
    });
    next(new OkResponse(users));
  } catch (e) {
    console.error("Error while calculating leaderboard", e);
    next(new BadRequestResponse("Server Error"));
  }
});


router.get("/all", async (req, res, next) => {
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 100,
  };
  options.skip = parseInt(options.limit) * (parseInt(options.page) - 1);
  console.log(options);
  try {
    const users = await User.aggregate([
      {
        $addFields: {
          totalLaplataEarned: {
            $sum: ["$laplataBalance", "$laplataWithdrawn"],
          },
        },
      },
      {
        $sort: {
          totalLaplataEarned: -1,
          username: 1,
        },
      },
      {
        $limit: options.limit + options.skip,
      },
      {
        $skip: options.skip,
      },
      {
        $project: {
          fullName: 1,
          totalLaplataEarned: 1,
          laplataWithdrawn: 1,
          laplataBalance: 1,
          username: 1,
          image: 1,
        },
      },
    ]).allowDiskUse(true);


    const userIds = users.map((e) => e._id);
    const challenges = await LOLChallenge.aggregate([
      {
        $match: {
          user: {
            $in: userIds,
          },
        },
      },
      {
        $group: {
          _id: "$user",
          totalChallenges: {
            $sum: 1,
          },
          totalVictories: {
            $sum: "$gameStatistics.victories",
          },
          totalGames: {
            $sum: "$gameStatistics.total",
          },
          totalDefeats: {
            $sum: "$gameStatistics.defeats",
          },
        },
      },
      {
        $project: {
          _id: 1,
          totalGames: 1,
          totalChallenges: 1,
          totalVictories: 1,
          totalDefeats: 1,
          winRatio: {
            $cond: [
              { $eq: ["$totalGames", 0] }, // Check if played games are 0
              0, // If true, then winRatio 0
              {
                $multiply: [
                  {
                    $divide: ["$totalVictories", "$totalGames"],
                  },
                  100,
                ],
              },
            ],
          },
        },
      },
    ]).allowDiskUse(true);
    challenges.forEach((challenge) => {
      challenge._id = new mongoose.Types.ObjectId(challenge._id);
      const user = users.find((e) => {
        return challenge._id.equals(e._id);
      });
      if (user) {
        user.statistics = challenge;
      }
    });
    const totalminers = await User.count({})
    const response = {
      result: {
        docs: users,
      },
      totalDocs: totalminers,
      limit: options.limit,
      page: options.page,
    };
    next(new OkResponse(response));
  } catch (e) {
    console.error("Error while calculating leaderboard", e);
    next(new BadRequestResponse("Server Error"));
  }
});

router.post("/miningchallenge", async (req, res, next) => {
  
  const startDate = req.body.startDate.substring(0, 10);
  const endDate = req.body.endDate.substring(0, 10);

  console.log("xxx", startDate, endDate)
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 100,
  };
  options.skip = parseInt(options.limit) * (parseInt(options.page) - 1);
  try {
    const users = await User.aggregate([
      {
        $addFields: {
          totalLaplataEarned: {
            $sum: ["$laplataBalance", "$laplataWithdrawn"],
          },
        },
      },
      {
        $sort: {
          totalLaplataEarned: -1,
          username: 1,
        },
      },
      {
        $limit: options.limit + options.skip,
      },
      {
        $skip: options.skip,
      },
      {
        $project: {
          fullName: 1,
          totalLaplataEarned: 1,
          laplataWithdrawn: 1,
          laplataBalance: 1,
          username: 1,
          image: 1,
        },
      },
    ]).allowDiskUse(true);

    const userIds = users.map((e) => e._id);

    const filteredchallenges = await LOLChallenge.aggregate([{
      $match: {
        "$and": [
          {
            rewardedLaplata: {
              $gt: 0,
            }
          },
          {
            "$and": [
              {
                createdAt: {
                  $gte: new Date(startDate),
                }
              },
              {
                createdAt: {
                  $lte: new Date(endDate),
                }
              }
            ]
          }
        ]
      },
    },
      {
        $group: {
          _id: "$user",
          totalChallenges: {
            $sum: 1,
          },
          minings: {
            $sum: "$rewardedLaplata",
          },
        },
      }
  ]).allowDiskUse(true);

    console.log("@@@@@@@@@@@@@@@@@", filteredchallenges);
    const totalminers = filteredchallenges.length


    const challenges = await LOLChallenge.aggregate([
      {
        $match: {
        "$and": [
          {
            user: {
            $in: userIds,
            }
          },
          {
            "$and": [
              {
                createdAt: {
                  $gte: new Date(startDate),
                }},
              {
                createdAt: {
                  $lte: new Date(endDate),
                }
              }
          ]
          }
      ]
        },
      },
      {
        $group: {
          _id: "$user",
          totalChallenges: {
            $sum: 1,
          },
          totalVictories: {
            $sum: "$gameStatistics.victories",
          },
          totalGames: {
            $sum: "$gameStatistics.total",
          },
          totalDefeats: {
            $sum: "$gameStatistics.defeats",
          },
          minings: {
            $sum: "$rewardedLaplata",
          },
        },
      },
      {
        $project: {
          _id: 1,
          totalGames: 1,
          totalChallenges: 1,
          totalVictories: 1,
          totalDefeats: 1,
          minings:1,
          winRatio: {
            $cond: [
              { $eq: ["$totalGames", 0] }, // Check if played games are 0
              0, // If true, then winRatio 0
              {
                $multiply: [
                  {
                    $divide: ["$totalVictories", "$totalGames"],
                  },
                  100,
                ],
              },
            ],
          },
        },
      },
    ]).allowDiskUse(true);

    challenges.forEach((challenge) => {    
      challenge._id = new mongoose.Types.ObjectId(challenge._id);
      const user = users.find((e) => {
        return challenge._id.equals(e._id);
      });
      if (user) {
        user.statistics = challenge;
      }
    });

  
    users.forEach((user)=>{
      if(user.statistics?true:false)
      {
        user.minings=user.statistics.minings;
      }
      else
      {
        user.minings=0.0;
      }
    });

    users.sort(function (a, b) {
      return b.minings - a.minings;
    });

    const response = {
      result: {
        docs: users,
      },
      totalDocs: totalminers,
      limit: options.limit,
      page: options.page,
    };
    next(new OkResponse(response));
  } catch (e) {
    console.error("Error while calculating leaderboard", e);
    next(new BadRequestResponse("Server Error"));
  }
});

router.get("/me", auth.required, auth.user, async (req, res, next) => {
  const rank = await User.aggregate([
    {
      $addFields: {
        totalLaplataEarned: {
          $sum: ["$laplataBalance", "$laplataWithdrawn"],
        },
      },
    },
    {
      $match: {
        totalLaplataEarned: {
          $gt: req.user.laplataWithdrawn + req.user.laplataBalance,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: 1,
        },
      },
    },
  ]);
  const totalUsers = await User.countDocuments();
  // console.log(totalUsers);
  console.log(rank);
  let response = {};
  if (rank.length) {
    response.rank = rank[0].total + 1;
    response.percentile = (response.rank / totalUsers) * 100;
    if (response.percentile < 1) {
      response.percentile = 1;
    }
  } else {
    response.rank = 1;
    response.percentile = 1;
  }
  next(new OkResponse(response));
});
module.exports = router;
