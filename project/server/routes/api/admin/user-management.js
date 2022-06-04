let mongoose = require("mongoose");
let router = require("express").Router();
let User = mongoose.model("User");

let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
  ForbiddenResponse
} = require("express-http-response");

const {
  validate,
  isEmailExist,
  isUsernameExist,
  isPhoneExist,
  isUpdateEmailExist, isUpdateUsernameExist
} = require("../../../validations");

const {
  sendEmailOTP,
  sendEmailForgotPasswordSuccess,
} = require("../../../utilities/smsService");
const { sendEmailCreateAdmin } = require("../../../utilities/emailService")
let faker = require("faker");
const { createAdmin } = require("../../../validations/users");

router.post("/list",function (req, res, next) {
    // TODO: validations here for server crashing
    const filter = req.body.filter;
    console.log("#####filter",filter)

    let mycriteria;
    if(filter.criteria==-1)
    {
      mycriteria ='createdAt';
    }
    else if(filter.criteria==1)
    {
      mycriteria = 'fullName';
    }
    else if (filter.criteria == 2)
    {
      mycriteria = 'laplataBalance';
    }

    const options = {
      page: filter.page,
      limit: filter.limit,
      select: filter.select || '_id username email fullName role status laplataBalance createdAt inActiveReason',
      sort: { [mycriteria]: [filter.order] },
    };

  // filter.sort ||
    console.log("#####options", options)
    let query = {};

    if (filter.query && filter.query !== '') {
      query = {
        $or: [
          { fullName: { $regex: '.*' + filter.query + '.*' }, },
          { email: { $regex: '.*' + filter.query + '.*' }, },
          { username: { $regex: '.*' + filter.query + '.*' }, }]
      };
    }
    if (filter.status && filter.status > -1) {
      query.status = filter.status;
    }
    if (filter.type && filter.type > -1) {
      query.role = filter.type;
    }

    User.paginate(query, options, function (err, result) {
      console.log("#####result", result)
        next(new OkResponse({ result: result }));
    });

  }
);
router.post(
  "/update/status",
  function (req, res, next) {

    // TODO validations here for server crashing

    User.updateOne({ username: req.body.user.username }, { status: req.body.user.status }, function (err, user) {
      if (err) {
        next(new ForbiddenResponse('User not found', 422))
      }

      next(new OkResponse({ message: 'User Updated' }));
    });

  }
);
router.post(
  "/create",
  createAdmin,
  validate,
  isUsernameExist,
  isEmailExist,
  function (req, res, next) {
    let user = new User();

    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.fullName = req.body.user.fullName;
    user.role = req.body.user.role || 2;
    user.image = req.body.user.image || null;
    user.setPassword(faker.random.alphaNumeric());

    user
      .save()
      .then(function () {
        sendEmailCreateAdmin({ email: user.email, fullName: user.fullName });
        next(new OkResponse({ user: user.toAuthJSON() }));
      })
      .catch(next);
  }
);
router.post(
  "/update/profile",
  isUpdateEmailExist, isUpdateUsernameExist,

  function (req, res, next) {
    let user = req.user;

    user.username = req.body.user.username || user.name;
    user.email = req.body.user.email || user.email;
    user.fullName = req.body.user.fullName || user.fullName;
    user.image = req.body.user.image || user.image;
    user
      .save()
      .then(function () {
        next(new OkResponse({ user: user.toAuthJSON() }));
      })
      .catch(next);
  }
);
router.post(
  "/update/password",
  function (req, res, next) {
    let user = req.user;
    if (user.validPassword(req.body.user.oldPassword)) {
      user.setPassword(req.body.user.newPassword);
      user
        .save()
        .then(function () {
          next(new OkResponse({}));
        })
        .catch(next);
    } else {
      next(new UnauthorizedResponse(`Your Password is invalid`, 401.1));

    }

  }
);
module.exports = router;
