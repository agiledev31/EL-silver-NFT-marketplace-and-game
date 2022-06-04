let router = require("express").Router();
let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");
let mongoose = require("mongoose");

const auth = require("../auth");
let Chat = mongoose.model("Chat");
let User = mongoose.model("User");


router.param("chatUser", function (req, res, next, id) {
  User.findById(id)
    .then(function (user) {
      if (!user) {
        return next(new BadRequestResponse("No User Found"));
      }
      req.chatUser = user;
      return next();
    });
});

router.get("/users", auth.required, auth.user, async function (req, res, next) {
 
  const userList = await User.aggregate([
    {
        $match: { _id: {$in: req.user.friends } }
    },
    { 
        $lookup: 
        {
            from: 'chats',
            localField: '_id',
            foreignField: 'createdBy',
            as: 'messages'
        },
    },
    {
        $project: 
        {
            _id: 1,
            fullName: 1,
            username: 1,
            image: 1,
            messages: 
            { 
                $filter: 
                { 
                    input: "$messages", 
                    as: "message", 
                    cond: { 
                        $and: [
                            { $eq: [ '$$message.isRead', false ] },
                            { $eq: [ '$$message.sentTo', req.user._id ] }
                        ]
                    }
                }
            }
        }
    }
  ]);
  next(new OkResponse({  userList }));
 
 
  
 });
 
router.get("/:chatUser", auth.required, auth.user, function (req, res, next) {
  const options = {
    page: req.query.page || 1,
    limit: req.query.limit || 20,
    sort: {
      createdAt: 0,
    },
  };

  let query = {
    $or: [
      { sentTo: req.chatUser._id, createdBy: req.user._id},
      { createdBy: req.chatUser._id, sentTo: req.user._id },
    ],
  };

  Chat.paginate(query, options, function (err, history) {
    if (err) {
      next(new BadRequestResponse("Server Error"));
    }
    next(new OkResponse({ history: history, chatUser: req.chatUser }));
  });
});



router.post("/", auth.required, auth.user, function (req, res, next) {
  // save the message and send Event
  let chat = new Chat();
            chat.createdBy = req.user._id;
            chat.sentTo = req.body.sentTo;
            chat.message = req.body.message;
            chat.save(
  function (err, doc) {
    if (err) {
      next(new BadRequestResponse("Server Error"));
    } else {
      lolSocket.emit('conversation'+req.body.sentTo);
      next(new OkResponse({  }));
    }
  });
});


module.exports = router;
