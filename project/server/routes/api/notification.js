let mongoose = require("mongoose");
let Notification = mongoose.model('Notification');
let router = require('express').Router();
let {
    OkResponse,
    BadRequestResponse,
    UnauthorizedResponse,
  } = require("express-http-response");
  let auth = require("../auth");

  const {sendNotification} = require('../../utilities/notification');

router.get('/create', function(req, res, next){
    sendNotification({title: 'Notification testing',type: 1,sentTo: '6023a9e0383dfc20346ba480'  })
    next(new OkResponse({message: 'notification sent'}));
});

router.get('/',auth.required, auth.user, function(req, res, next){
    const options = {
        page: +req.query.page || 1,
        limit: +req.query.page || 10,
        sort: {'createdAt': -1},
        populate: 'user',
        useCustomCountFn: function () {
            return Notification.count({sentTo: req.user._id,isRead: false});
          },
      }
    Notification.paginate({sentTo: req.user._id}, options, function (err, result) {
            if (err) { next(new BadRequestResponse("Server Error")) }
            next(new OkResponse({ result: result }));
        });
});
router.get('/mark-all',auth.required, auth.user, function(req, res, next){
  Notification.updateMany({sentTo: req.user._id, isRead: false}, { $set: { isRead: true } }, function (err, result) {
          if (err) { next(new BadRequestResponse("Server Error")) }
          next(new OkResponse());
      });
});
router.get('/mark-as-read/:notificationId',auth.required, auth.user, function(req, res, next){
  Notification.updateOne({sentTo: req.user._id, _id: req.params.notificationId}, { $set: { isRead: true } }, function (err, result) {
          if (err) { next(new BadRequestResponse("Server Error")) }
          next(new OkResponse());
      });
});


module.exports = router;
