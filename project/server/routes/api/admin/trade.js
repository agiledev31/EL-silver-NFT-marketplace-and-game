let router = require("express").Router();
let mongoose = require("mongoose");

let Transaction = mongoose.model("SystemTransaction");
let P2PTrade = mongoose.model("P2PTrade");
let { OkResponse, BadRequestResponse } = require("express-http-response");

router.get("/transaction", function (req, res, next) {
  const options = {
    page: req.query.page || 1,
    limit: req.query.limit || 20,
    sort: {
      createdAt: 1,
    },
    populate: ["tradeWith", "user"],
  };

  Transaction.paginate({}, options, function (err, result) {
    if (err) {
      next(new BadRequestResponse("Server Error"));
    }
    next(new OkResponse({ result: result }));
  });
});

router.get("/p2p", function (req, res, next) {
    const options = {
      page: req.query.page || 1,
      limit: req.query.limit || 20,
      sort: {
        createdAt: -1,
      },
      populate: [
            "user",
            { path: "requests", populate: { path: "user", model: "User" } },
          ],
    };
  
    P2PTrade.paginate({}, options, function (err, result) {
      if (err) {
        next(new BadRequestResponse("Server Error"));
      }
      next(new OkResponse({ result: result }));
    });
  });

module.exports = router;
