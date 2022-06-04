let mongoose = require("mongoose");
let router = require("express").Router();
let passport = require("passport");
let User = mongoose.model("User");
const moment = require("moment");

let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");
const {
  loginEmail,
  createAdmin,
} = require("../../../validations/users");
const {
  validate,
  isEmailExist,
  isUsernameExist,
} = require("../../../validations");
const {
  sendEmailVerificationOTP,
  sendEmailVerificationSuccess,
  sendEmailOTP,
  sendEmailForgotPasswordSuccess
} = require("../../../utilities/emailService");
const {
  sendSMSVerificationSuccess,
  sendSMS_OTP,
  sendSMSForgotPasswordSuccess,
} = require("../../../utilities/smsService");
let faker = require("faker");


// ------------------------------  Admin Routes   ----------------------

router.post("/login", loginEmail, validate, function (req, res, next) {
  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {

      if (err) {
        next(new BadRequestResponse(err.message));
      } else if (user && user.status === 2) {
        next(
          new UnauthorizedResponse(
            "Your Account is Blocked!, Contact to Support please",
            401.1
          )
        );
      } else if (user && (user.role == 2 || user.role == 3)) {
        next(new OkResponse({ user: user.toAuthJSON() }));
      } else {
        next(new UnauthorizedResponse());
      }
    }
  )(req, res, next);
});
router.post(
  "/verify",

  function (req, res, next) {
    if (!(req.body.user && req.body.user.email && req.body.user.otp)) {
      next(new BadRequestResponse("Missing required parameter.", 422.0))
    }
    let query = {
      otp: req.body.user.otp,
      otpExpires: { $gt: Date.now() },
      email: req.body.user.email, $or: [{ role: 2 }, { role: 3 }],
    };

    User.findOne(
      query,
      function (err, user) {
        if (err || !user) {
          next(new UnauthorizedResponse(`OTP is invalid`, 401.1));
        } else {
          user.otp = null;
          user.otpExpires = null;

          // sendEmailVerificationSuccess({ email: user.email, fullName: user.fullName })


          user.save().then(function () {
            next(new OkResponse({}));
          });
        }
      }
    );
  }
);
router.post("/reset/password", function (req, res, next) {

  if (!(req.body.user && req.body.user.email)) {
    next(new BadRequestResponse("Missing required parameter.", 422.0))
  }


  User.findOne(
    { email: req.body.user.email, $or: [{ role: 2 }, { role: 3 }] },
    function (err, user) {
      if ((err || !user)) {
        next(new UnauthorizedResponse(`Email  is invalid`, 401.1));
      } else {
        user.setPassword(req.body.user.password);


        sendEmailForgotPasswordSuccess({ email: user.email, fullName: user.fullName })

        user.save().then(function () {
          next(new OkResponse({}));
        }).catch(e => { });
      }
    }
  );
  next(new OkResponse({}));
});
router.post(
  "/forgot-password",

  function (req, res, next) {

    if (!(req.body.user && req.body.user.email)) {
      next(new BadRequestResponse("Missing required parameter.", 422.0))
    }

    User.findOne(
      { email: req.body.user.email, $or: [{ role: 2 }, { role: 3 }] },
      function (err, user) {
        if ((err || !user)) {
          next(new UnauthorizedResponse(`Email  is invalid`, 401.1));
        } else {
          user.setOTP();

          // send email notification
          sendEmailOTP({ email: user.email, fullName: user.fullName, otp: user.otp })


          user.save().then(function () {
            next(new OkResponse({ OTP: user.otp }));
          }).catch(e => { });
        }
      }
    );
  }
);

router.post("/user-growth", async function (req, res, next) {
  try {
    let user = {};
    let dailyUserGrowth = await User.count({
      createdAt: {
        $gte: moment().startOf('day'),
        $lte: moment().endOf('day')
      }
    })

    let weeklyUserGrowth = await User.count({
      createdAt: {
        $gte: moment().startOf('week'),
        $lte: moment().endOf('week')
      }
    })

    let monthlyUserGrowth = await User.count({
      createdAt: {
        $gte: moment().startOf('month'),
        $lte: moment().endOf('month')
      }
    })

    let startDate = req.body.dateFilter.startDate;
    let endDate = req.body.dateFilter.endDate;
   

    let filterUserGrowth = await User.count({
      createdAt: {
        $gte: startDate ? startDate : moment().subtract(1, 'month').endOf('day'),
        $lte: endDate ? endDate : moment(Date.now())
      }
    })

    user.dailyUserGrowth = dailyUserGrowth;
    user.weeklyUserGrowth = weeklyUserGrowth;
    user.monthlyUserGrowth = monthlyUserGrowth;
    user.filterUserGrowth = filterUserGrowth;

    return next(new OkResponse(user));
  }
  catch (e) {
    console.log("Error while calculating user growth.", e);
    return next(new BadRequestResponse("Server Error"))
  }
})

module.exports = router;
