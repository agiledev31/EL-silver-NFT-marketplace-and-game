let router = require("express").Router();
let mongoose = require("mongoose");
let Voucher = mongoose.model("Voucher");
let faker = require("faker");
let { OkResponse, BadRequestResponse } = require("express-http-response");
router.param("id", function (req, res, next, id) {
  Voucher.findOne({_id:id, isDelete: false})
    .populate("createdBy")
    .populate("usedBy")
    .then((doc) => {
      if (!doc) {
        return res.sendStatus(404);
      }
      req.voucher = doc;
      return next();
    })
    .catch(next);
});
// return all voucher
router.get("/all", function (req, res, next) {
  const options = {
    page: req.query.page || 1,
    limit: req.query.limit || 20,
    sort: {
      createdAt: -1,
    },
    populate:[ "createdBy", "usedBy"],
  };

  Voucher.paginate({isDelete: false}, options, function (err, result) {
    if (err) {
      next(new BadRequestResponse("Server Error"));
    }
    next(new OkResponse({ result: result }));
  });
});
router.get("/:id", function (req, res, next) {
  next(new OkResponse({ voucher: req.voucher }));
});
// create voucher
router.post("/", async function (req, res, next) {
  if (req.body.silver && req.body.validThru) {
    let voucher = await Voucher.findOne({ voucherCode: req.body.voucherCode });
    if (voucher) next(new BadRequestResponse("Voucher already exist",401));
    else
      new Voucher({
        silver: req.body.silver,
        validThru: req.body.validThru,
        voucherCode: req.body.voucherCode || faker.random.alphaNumeric(5),
        createdBy: req.user,
      }).save((err, doc) => {
        if (err) {
          next(new BadRequestResponse("Server Error"));
        } else {
          next(new OkResponse({ voucher: doc }));
        }
      });
  } else {
    next(new BadRequestResponse("missing parameters", 422));
  }
});

// updates voucher
router.put("/:id", function (req, res, next) {
  if (req.body.validThru) {
    req.voucher.validThru = req.body.validThru;
    req.voucher.save((err, doc) => {
      if (err) {
        next(new BadRequestResponse("Server Error"));
      } else {
        next(new OkResponse({ voucher: doc }));
      }
    });
  } else {
    next(new BadRequestResponse("missing parameters", 422));
  }
});

router.delete("/:id", function (req, res, next) {
  req.voucher.isDelete = true;
  req.voucher.save((err, doc) => {
    if (err) {
      next(new BadRequestResponse("Server Error"));
    } else {
      next(new OkResponse({ voucher: doc }));
    }
  });
});

module.exports = router;
