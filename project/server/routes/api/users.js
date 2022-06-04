let mongoose = require("mongoose");
let router = require("express").Router();
let passport = require("passport");
let User = mongoose.model("User");
let auth = require("../auth");
let moment = require('moment');
let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");
const {
  registerEmail,
  loginEmail,
  loginPhone,
  verifyPhone,
  verifyEmail,
  registerPhone,
} = require("../../validations/users");
const {
  validate,
  isEmailExist,
  isUsernameExist,
  isPhoneExist,
  isUpdateEmailExist, isUpdateUsernameExist
} = require("../../validations");
const {
  sendEmailVerificationOTP,
  sendEmailVerificationLink,
  sendEmailVerificationSuccess,
  sendEmailOTP,
  sendEmailLink,
  sendEmailForgotPasswordSuccess
} = require("../../utilities/emailService");
const {
  sendSMSVerificationSuccess,
  sendSMS_OTP,
  sendSMSForgotPasswordSuccess,
} = require("../../utilities/smsService");
const { sendNotification } = require('../../utilities/notification');
let faker = require("faker");

router.get("/users", function (req, res, next) {
  User.find()
    .then(function (users) {
      if (!users) {
        return res.sendStatus(401);
      }

      return res.json({ users: users });
    })
    .catch(next);
});

router.get(
  "/user/context",
  auth.required,
  auth.user,
  function (req, res, next) {
    console.log("############user context", req.user, "##################")
    let user = req.user;
    user.isOnline = true;
    user.save().then(function () {
      console.log('Just logging in')
      // let other know that am online
      next(new OkResponse({ user: user.toAuthJSON() }));
    });
    // sendEmailVerificationOTP({email: req.user.email, fullName: req.user.fullName, otp: '1231'});
    // sendEmailVerificationSuccess({email: req.user.email, fullName: req.user.fullName});
    // sendEmailForgotPasswordOTP({email: req.user.email, fullName: req.user.fullName, otp: '1231'});

  });

router.get(
  "/user/friends",
  auth.required,
  auth.user,
  function (req, res, next) {

    User.find({ _id: { $in: req.user.friends } }, (err, friends) => {
      next(new OkResponse({ friends: friends }));
    }).catch(e => {
      next(new BadRequestResponse(`Server Error`, 500))
    })
  }
);


router.get("/users/friendsToAdd", auth.required, auth.user, function (req, res, next) {

  let f = req.user.friends;
  f.push(req.user._id);
  User.find({ _id: { $nin: f }, role: 1 }, { "_id": 1, "fullName": 1, "image": 1 }, function (err, docs) {
    ;
    if (err) { next(new BadRequestResponse(`Server Error`, 500)) }
    else {

      // TODO change this slicing
      next(new OkResponse({ users: docs.slice(0, 9) }))
    }

  })
});

router.post("/users/login/google", function (req, res, next) {
  User.findOne({
    email: req.body.user.email
  }).then(function (user) {
    if (user) {
      user.googleAuthToken = req.body.user.authToken;
    } else {
      user = new User();
      user.username = req.body.user.fullName.replace(/\s/g, '') + faker.random.number(9999);
      user.email = req.body.user.email;
      user.fullName = req.body.user.fullName;
      user.googleAuthToken = req.body.user.authToken;
      user.image = req.body.user.photoUrl;
      user.setPassword(faker.random.alphaNumeric());
    }
    user.save(function (err) {
      next(new OkResponse({ user: user.toAuthJSON() }));
    });
  });
});

router.post(
  "/users/login/phone",
  loginPhone,
  validate,
  function (req, res, next) {
    User.findOne({ phone: req.body.user.phone }).then((user) => {
      if (!user) {
        next(new UnauthorizedResponse(`Phone Doesn't Exist`, 401.1));
      } else {
        user.setOTP();
        sendSMS_OTP(user);

        user
          .save()
          .then(function () {
            next(new OkResponse({ OTP: user.otp }));
          })
          .catch(next);
      }
    });
  }
);

router.post(
  "/users/login/email",
  loginEmail,
  validate,
  function (req, res, next) {
    passport.authenticate(
      "local",
      { session: false },
      function (err, user, info) {
        if (err) {
          next(new BadRequestResponse(err.message));
        } else if (user && user.token != null) {
          next(new UnauthorizedResponse(`Your account is not verified. Please verify via the email sent on your email.`, 401.2));

        }
        else if (user && user.status === 2) {
          next(
            new UnauthorizedResponse(
              "Your Account is Blocked!, Contact to Support please",
              401.1
            )
          );
        }
        if (user && user.role == 1) {
          next(new OkResponse({ user: user.toAuthJSON() }));
        } else {
          next(new UnauthorizedResponse());
        }
      }
    )(req, res, next);
  }
);

// router.post(
//   "/users/register/email",
//   registerEmail,
//   validate,
//   isUsernameExist,
//   isEmailExist,
//   function (req, res, next) {
//     let user = new User();

//     user.username = req.body.user.username;
//     user.email = req.body.user.email;
//     user.fullName = req.body.user.fullName;
//     user.image = `https://avatars.dicebear.com/api/bottts/${req.body.user.fullName}.svg`;
//     user.setPassword(req.body.user.password);
//     user.setOTP();
//     sendEmailVerificationOTP({ email: user.email, fullName: user.fullName, otp: user.otp });

//     user
//       .save()
//       .then(function () {
//         next(new OkResponse({ OTP: user.otp }));
//       })
//       .catch(next);
//   }
// );

router.post(
  "/users/register/email",
  registerEmail,
  validate,
  isUsernameExist,
  isEmailExist,
  function (req, res, next) {
    let user = new User();

    user.url = req.body.user.url;
    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.fullName = req.body.user.fullName;
    user.image = `https://avatars.dicebear.com/api/bottts/${req.body.user.fullName}.svg`;
    user.setPassword(req.body.user.password);
    let token = user.generateJWT();
    user.token = token;
    user.tokenExpires = moment(Date.now()).add(60, 'minutes')

    sendEmailVerificationLink({ email: user.email, fullName: user.fullName, token: token, url: user.url });

    user
      .save()
      .then(function () {
        next(new OkResponse({}));
      })
      .catch(next);
  }
);

router.post(
  "/users/register/phone",
  registerPhone,
  validate,
  isPhoneExist,
  function (req, res, next) {
    let user = new User();

    user.username = req.body.user.fullName.replace(/\s/g, '') + faker.random.number(9999999);
    user.email = req.body.user.email;
    user.fullName = req.body.user.fullName;
    user.image = `https://avatars.dicebear.com/api/bottts/${req.body.user.fullName}.svg`;
    user.setPassword(faker.random.alphaNumeric());
    user.phone = req.body.user.phone;
    user.setOTP();
    sendSMS_OTP(user);

    user
      .save()
      .then(function () {
        next(new OkResponse({ OTP: user.otp }));
      })
      .catch(next);
  }
);



router.post(
  "/users/verify",

  function (req, res, next) {

    if (!(req.body.user && req.body.user.type)) {
      next(new BadRequestResponse("Missing required parameter.", 422.0))
    }
    const isPhone = req.body.user.type == 2;
    let query = {
      token: req.body.user.token,
      tokenExpires: { $gt: Date.now() },
    };
    // isPhone ? query.phone = req.body.user.sentTo : query.email = req.body.user.sentTo;
    User.findOne(
      query,
      function (err, user) {
        if (err || !user) {
          next(new UnauthorizedResponse(`Link has been expired`, 401.1));
        }
        else {
          user.token = null;
          user.tokenExpires = null;

          user.save().then(function () {
            next(new OkResponse({ user: user.toAuthJSON() }));
          });
        }
      }
    );
  }
);



router.post(
  "/users/verify/resend",

  function (req, res, next) {

    if (!(req.body.user && req.body.user.type)) {
      next(new BadRequestResponse("Missing required parameter.", 422.0))
    }

    const isPhone = req.body.user.type == 2;
    let query = {
      email: req.body.user.email
    }
    // isPhone ? query.phone = req.body.user.sentTo : query.email = req.body.user.sentTo;

    User.findOne(
      query,
      function (err, user) {
        if ((err || !user)) {
          // next(new UnauthorizedResponse(`${isPhone ? 'Phone' : 'Email'} is invalid`, isPhone ? 401.2 : 401.1));
          next(new UnauthorizedResponse(`${query.email} is invalid`, 401.1));
        } else {
          user.url = req.body.user.url;
          user.email = req.body.user.email;
          let token = user.generateJWT();
          user.token = token;
          user.tokenExpires = moment(Date.now()).add(60, 'minutes')

          sendEmailLink({ email: user.email, fullName: user.fullName, token: token, url: user.url });

          user.save().then(function () {
            next(new OkResponse({ token: user.token }));
          }).catch(e => { });
        }
      }
    );
  }
);



router.post("/users/reset/password", function (req, res, next) {
  // check the otp and otp expiry
  // update the password
  // send the notification , email notification and phone notification if he have

  if (!(req.body.user && req.body.user.type)) {
    next(new BadRequestResponse("Missing required parameter.", 422.0))
  }

  const isPhone = req.body.user.type == 2;
  let query = {};
  isPhone ? query.phone = req.body.user.sentTo : query.email = req.body.user.sentTo;
  User.findOne(
    query,
    function (err, user) {
      if ((err || !user)) {
        next(new UnauthorizedResponse(`${isPhone ? 'Phone' : 'Email'} is invalid`, isPhone ? 401.2 : 401.1));
      } else {
        user.setPassword(req.body.user.password);
        if (isPhone) {
          // send notification
          sendSMSForgotPasswordSuccess(user);
        } else {
          sendEmailForgotPasswordSuccess({ email: user.email, fullName: user.fullName })
        }
        user.save().then(function () {
          next(new OkResponse({}));
        }).catch(e => console.log(e));
      }
    }
  );
  next(new OkResponse({}));
});

router.put("/users", auth.required,
  auth.user, function (req, res, next) {
    let user = req.user;

    if (
      req.body.user.fullName &&
      typeof req.body.user.fullName !== "undefined"
    ) {
      user.fullName = req.body.user.fullName;
    }
    if (req.body.user.image && typeof req.body.user.image !== "undefined") {
      user.image = req.body.user.image;
    }

    if (
      req.body.user.password &&
      typeof req.body.user.password !== "undefined"
    ) {
      user.setPassword(req.body.user.password);
    }

    if (
      req.body.user.friend &&
      typeof req.body.user.friend !== "undefined"
    ) {
      user.friends.push(req.body.user.friend);
    }
    // const currentLocation = { type: 'Point', coordinates: [req.body.user.lat, req.body.user.lng] };
    // user.location = currentLocation;

    user.save().then(function () {
      next(new OkResponse({ user: user.toAuthJSON() }));
    });

  });


router.post("/users/generatereferral", auth.required, auth.user, function (req, res, next) {

  let user = req.user;
  user.generateReferralCode();
  user.save().then(function () {
    next(new OkResponse({ CODE: user.referralcode }));
  });

});

router.post("/users/applyreferral", auth.required, auth.user, function (req, res, next) {

  let user = req.user;
  console.log("@@@@@@@@", req.body.referralcode);

  User.countDocuments({ referralcode: req.body.referralcode }, function (err, count) {
    if (err) {
      console.log(err)
    } else {
      if (count) {
        user.applyReferralCode(req.body.referralcode);
        user
          .save()
          .then(function () {
            next(new OkResponse({}));
          })
          .catch(next);
      } else {
        next(new BadRequestResponse(`Your Referral is invalid`, 401.1));
      }
    }
  });
});

router.post("/users/myFriends", auth.required, auth.user, function (req, res, next) {
  const options = {
    page: req.body.page || 1,
    limit: req.body.limit || 10,
    select: 'fullName image email phone username _id'
  }

  let query = {}
  query._id = req.user.friends;

  User.paginate(query, options, function (err, result) {
    if (err) { next(new BadRequestResponse("Server Error")) }
    next(new OkResponse({ result: result, _id: req.user._id }));
  });

});


router.post(
  "/update/profile",
  auth.required, auth.user,
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
  auth.required, auth.user,

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
