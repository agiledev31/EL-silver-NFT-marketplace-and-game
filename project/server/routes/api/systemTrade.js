let mongoose = require("mongoose");
let router = require("express").Router();
let httpResponse = require("express-http-response");

const axios = require("axios");
const { goldApiServerKey } = require("../../config");
let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");
let auth = require("../auth");

let User = mongoose.model("User");
let SystemAsset = mongoose.model("SystemAsset");
let Transaction = mongoose.model("SystemTransaction");
let P2PTrade = mongoose.model("P2PTrade");
let Voucher = mongoose.model("Voucher");

const {sendNotification} = require('../../utilities/notification');
const {silver} = require('../../utilities/todaySilverPrice');


const { startSession } = require("mongoose");

// Preload P2PTrade on routes with ':p2pTrade'
router.param('p2pTrade', function(req, res, next, postId){
    P2PTrade.findById(postId)
    .populate([
      "user",
      { path: "requests", populate: { path: "user", model: "User" } },
    ])
    .then((doc) => {
      if (!doc) { return res.sendStatus(404); }
      req.p2p =  doc;
      return next();
    }).catch(next);
 
});

router.get("/", silver, function (req, res, next) {
  const systemBalanceAsset = new SystemAsset({ key: "balance", value: 0 });
  const systemSilverAsset = new SystemAsset({ key: "silver", value: 0 });
  systemSilverAsset.save();
  systemBalanceAsset.save();
  next(new OkResponse({ message: req.silver }));
});

// get transactions
router.post(
  "/transactions",
  auth.required,
  auth.user,
  async function (req, res, next) {
    const param = req.body;
    let userIds = [];
    let query = {};

    if (param && param.subType && param.subType != 0)
      query.subType = param.subType;
    if (param && param.type && param.type != 0) query.type = param.type;

    if (param && param.query != "") {
      userIds = await User.find({
        _id: { $ne: req.user._id },
      }).or([
        {username: { $regex: param.query, $options: "i" }},
        {fullName: { $regex: param.query, $options: "i" }},
        {email: { $regex: param.query, $options: "i" }},
      ]);
    }
    query.user = req.user._id;
    if(userIds.length > 0) {
      query.tradeWith = { $in: userIds }; // use in userIds
    }

    const options = {
      page: param.page || 1,
      limit: param.limit || 10,
      sort: { createdAt: param.sort || 1 },
      populate: ["tradeWith", "user"],
    };

    Transaction.paginate(query, options, function (err, result) {
      if (err) {
        next(new BadRequestResponse("Server Error"));
      }
      next(new OkResponse({ result: result }));
    });
  }
);

// create an instant buy post
router.post(
  "/instant/buy",
  auth.required,
  auth.user,
  silver,
  async function (req, res, next) {
    if (req.body.instantTrade && req.body.instantTrade.amount) {
      const silverPrice = req.body.instantTrade.amount;
      const silver = silverPrice / req.silver;

      // TODO raise an event to populate user again
      // TODO DOIT with transactions
      try {
        const user = req.user;
        // check here if user's balance is greater than the silverPrice
        user.balance = user.balance - silverPrice;
        user.silver = user.silver + silver;
        const transaction = await Transaction({
          type: 1,
          subType: 1,
          tradeWith: null,
          user: req.user,
          silver: {
            amount: silver,
            price: silverPrice,
          },
          closing: {
            silver: user.silver,
            balance: user.balance,
          },
          status: 1,
        }).save();
        const systemSilverAsset = await SystemAsset.findOneAndUpdate(
          { key: "silver" },
          { $inc: { value: -silver } }
        );
        const systemBalanceAsset = await SystemAsset.findOneAndUpdate(
          { key: "balance" },
          { $inc: { value: +silverPrice } }
        );
        const savedUser = await user.save();
        lolSocket.emit('user'+user._id);
        sendNotification( {
          title: `Buy Transaction Successful!`,
          type: 1,
          sentTo: req.user._id,
          })
        next(new OkResponse({ message: "Successfully Done" }));
      } catch (error) {
        next(new BadRequestResponse(`Server Error`, 500));
      }
    } else {
      next(new BadRequestResponse(`Server Error`, 500));
    }
  }
);

// create an instant sell post
router.post(
  "/instant/sell",
  auth.required,
  auth.user,
  silver,
  async function (req, res, next) {
    if (req.body.instantTrade && req.body.instantTrade.silver) {
      const silver = req.body.instantTrade.silver;
      const silverPrice = silver * req.silver;

      // TODO raise an event to populate user again
      // TODO DOIT with transactions
      try {
        const user = req.user;
        user.balance = user.balance + silverPrice;
        // check here if user's silver is greater than the sellingSilver
        user.silver = user.silver - silver;
        const transaction = await Transaction({
          type: 1,
          subType: 2,
          tradeWith: null,
          user: req.user,
          silver: {
            amount: silver,
            price: silverPrice,
          },
          closing: {
            silver: user.silver,
            balance: user.balance,
          },
          status: 1,
        }).save();
        const systemSilverAsset = await SystemAsset.findOneAndUpdate(
          { key: "silver" },
          { $inc: { value: +silver } }
        );
        const systemBalanceAsset = await SystemAsset.findOneAndUpdate(
          { key: "balance" },
          { $inc: { value: -silverPrice } }
        );
        
        const savedUser = await user.save();
        lolSocket.emit('user'+user._id);
        sendNotification( {
          title: `Sell Transaction Successful!`,
          type: 1,
          sentTo: req.user._id,
          })
        next(new OkResponse({ message: "Successfully Done" }));
      } catch (error) {
        next(new BadRequestResponse(`Server Error`, 500));
      }
    } else {
      next(new BadRequestResponse(`Server Error`, 500));
    }
  }
);
// ----------------------- Send Silver To Friend -----------------
router.post(
  "/sendSilverFriend",
  auth.required,
  auth.user,
  silver,
  async function (req, res, next) {
    if (req.body.friends) {
      try {
      const reqFriends = req.body.friends;
      let friendIds = reqFriends.map((friend) => friend._id);
      let friends = await User.find({ _id: { $in: friendIds } });
      const systemSilverAsset = await SystemAsset.findOne({ key: "silver" });
      let transactions = [];
      friends.forEach((friend) => {
        const transactionSilver = +reqFriends[
          reqFriends.findIndex((el) => el._id == friend._id)
        ].silver;
        if (req.user.silver > transactionSilver) {
          friend.silver = friend.silver + transactionSilver;
          req.user.silver = req.user.silver - transactionSilver- (+req.system.sendSilverFee);
          systemSilverAsset.value = systemSilverAsset.value + (+req.system.sendSilverFee);
        transactions.push(
          new Transaction({ // update the friend
            type: 4,
            subType: 1,
            tradeWith: req.user._id,
            user: friend._id,
            silver: {
              amount: transactionSilver,
              price: transactionSilver*req.silver,
            },
            closing: {
              silver: friend.silver,
              balance: friend.balance,
            },
            status: 1,
          })
        );
        transactions.push({// update the current User
          type: 4,
          subType: 2,
          tradeWith: friend._id,
          user: req.user._id,
          silver: {
            amount: transactionSilver,
            price: transactionSilver*req.silver,
          },
          closing: {
            silver: req.user.silver,
            balance: req.user.balance,
          },
          status: 1,
        })
        }
      });
      const userPromises = friends.map(friend => {
        return new Promise((resolve, reject) => {
          friend.save((error, result) => {
            if (error) {
              reject(error)
            }
            resolve(result);
          })
        })
      });
      Promise.all([
        req.user.save(), // save the req.user 
        ...userPromises, // save the friends
        Transaction.insertMany(transactions), // save the transactions
        systemSilverAsset.save() // save the systemAssets
      ]).then(results => {
        lolSocket.emit('user'+req.user._id);
        sendNotification( {
          title: `Silver Sent to friends`,
          type: 1,
          sentTo: req.user._id,
          })
          reqFriends.forEach((friend) => {
            lolSocket.emit('user'+friend._id);
            sendNotification( {
              title: `${req.user.fullName} sent ${friend.silver}gm Silver`,
              type: 1,
              sentTo: friend._id,
              })
          })
        next(new OkResponse({ message: results }));
      });

      
      
      

     

      // TODO refactor this and make database transactions
      
      } catch (error) {
        next(new BadRequestResponse(error, 500));
      }
    } else {
      next(new BadRequestResponse(`Friends List is required`, 422));
    }
  }
);

// ---------------------- P2P Trade ------------------------------

//create P2p post
router.post("/p2p/post", auth.required, auth.user, function (req, res, next) {
  if (req.body.type == 2 && req.user.silver < req.body.amount) {
    next(new BadRequestResponse("Your current Silver amount is low", 422));
  } else {
    new P2PTrade({
      type: req.body.type,
      silver: req.body.amount,
      margin: req.body.margin,
      Location: req.body.country,
      paymentMethod: req.body.paymentMethod,
      description: req.body.description,
      user: req.user,
    }).save(function (err, doc) {
      if (err) {
        next(new BadRequestResponse(`Server Error`, 500));
      }
      next(new OkResponse({ message: "P2P Post created successfully." }));
    });
  }
});
//get By ID post
router.get(
  "/p2p/post/:p2pTrade",
  auth.required,
  auth.user,
  function (req, res, next) {
   
        next(new OkResponse({ trade: req.p2p }));
     
  });
//get All post
router.post("/p2p/getAll", auth.required, auth.user, function (req, res, next) {
  const param = req.body;
  const options = {
    page: param.page || 1,
    limit: param.limit || 10,
    sort: { createdAt: param.sort || 1 },
    populate: "user",
  };
  let query = {};
  if (param.type === 1) {
    query.type = 1;
    query.user = { $ne: req.user._id };
  } else if (param.type === 2) {
    query.type = 2;
    query.user = { $ne: req.user._id };
  } else if (param.type === 3) {
    query.type = 1;
    query.user = req.user._id;
  } else if (param.type === 4) {
    query.type = 2;
    query.user = req.user._id;
  }
  if (param.paymentMethod) {
    query.paymentMethod = param.paymentMethod;
  }
  if (param.country) {
    query.country = param.country;
  }
  P2PTrade.paginate(query, options, function (err, result) {
    if (err) {
      next(new BadRequestResponse("Server Error"));
    } else {
      next(new OkResponse({ result: result }));
    }
  });
});

// save the open trade request
router.put(
  "/p2p/open-request/:tradeId",
  auth.required,
  auth.user,
  function (req, res, next) {
    const param = req.body;
    P2PTrade.findOneAndUpdate(
      { _id: req.params.tradeId },
      {
        $push: {
          requests: {
            silver: param.silver,
            priceWithMargin: param.amount,
            user: req.user._id,
            startsOn: Date.now()
          },
        },
      },{new: true}).populate([
        "user",
        { path: "requests", populate: { path: "user", model: "User" } },
      ]).then(
      function ( doc) {
        if (!doc) {
          next(new BadRequestResponse("Server Error"));
        } else {
          lolSocket.emit('p2pTrade'+doc._id);
          sendNotification( {
            title: `${req.user.fullName} opened a requet`,
            type: 5,
            sentTo: doc.user._id,
            user: req.user._id,data: { p2pTradeId: doc._id} 
            })
          next(new OkResponse({ result: doc }));
        }
      }
    ).catch(e => {});
  }
);
// this confirms the request and have the silver in escrow
router.put(
  "/p2p/post/:p2pTrade/request/:requestId",
  auth.required,
  auth.user,
  silver,
  async function (req, res, next) {

    let request = req.p2p.requests.id(req.params.requestId);
    const {status, reviews} = req.body;

    let promises = [];
    let notification = null;
    try {
    if(req.p2p.type === 2) {
      if(status === 2 &&( req.p2p.user.silver < request.silver || req.p2p.silver < request.silver)) {
        throw new Error('Silver Balance is Low');
      } else if(status === 2 && req.p2p.user.silver >= request.silver && req.p2p.silver >= request.silver) {
        req.p2p.silver = req.p2p.silver - parseFloat(request.silver);
        request.status = 2;
        req.p2p.user.silver = req.p2p.user.silver - parseFloat(request.silver);
        req.p2p.user.escrowSilver = req.p2p.user.escrowSilver + parseFloat(request.silver);
        req.p2p.openedOn = Date.now();
        promises.push(req.p2p.user.save())
  
        notification = {
          title: `${req.p2p.user.fullName} confirms the P2P Trade`,
          type: 5,
          sentTo: request.user,
          user: req.p2p.user._id,data: {requestId: request._id, p2pTradeId: req.p2p._id}  };
        save(req, res, next,promises,notification);
  
      } else if (status === 0) {
        request.status = 0;
        
        notification = {
          title: `${req.p2p.user.fullName} denied the P2P Trade`,
          type: 5,
          sentTo: request.user,
          user: req.p2p.user._id,data: {requestId: request._id, p2pTradeId: req.p2p._id}  };
        save(req, res, next,promises,notification);
  
      } else if (status === 3) {
        request.status = 3;
        req.p2p.paidOn = Date.now();
        
        notification = {
          title: `${request.user.fullName} sent the payment`,
          type: 5,
          sentTo: req.p2p.user._id,
          user:  request.user,data: {requestId: request._id, p2pTradeId: req.p2p._id}  };
        save(req, res, next,promises,notification);
  
      } else if (status === 4) {
        request.status = 4;
        req.p2p.confirmsOn = Date.now();
  
        req.p2p.user.escrowSilver = req.p2p.user.escrowSilver - parseFloat(request.silver);
        promises.push(req.p2p.user.save());
  
        request.user.silver = request.user.silver + parseFloat(request.silver);
        promises.push(request.user.save());
        lolSocket.emit('user'+request.user._id);

        promises.push(
          new Transaction({
            type: 2,
            subType: 1,
            tradeWith: req.p2p.user._id,
            user: request.user._id,
            silver: {
              amount: request.silver,
              price: request.silver*req.silver,
            },
            closing: {
              silver: request.user.silver,
              balance: request.user.balance,
            },
            status: 1,
          }).save());
          promises.push(
            new Transaction({
              type: 2,
              subType: 2,
              tradeWith: request.user._id,
              user: req.p2p.user._id,
              silver: {
                amount: request.silver,
                price: request.silver*req.silver,
              },
              closing: {
                silver: req.p2p.user.silver,
                balance: req.p2p.user.balance,
              },
              status: 1,
            }).save());
        notification = {
          title: `${req.p2p.user.fullName} confirms the payment and releases the Silver`,
          type: 5,
          sentTo: request.user,
          user: req.p2p.user._id,data: {requestId: request._id, p2pTradeId: req.p2p._id}  };
        save(req, res, next,promises,notification);
  
      }else if (status === 5) {
        request.status = 5;
        request.userReviews = reviews;
        save(req, res, next,promises,notification);
      }else if (status === 6) {
        request.status = 6;
        request.tradeUserReviews = reviews;
        save(req, res, next,promises,notification);
      } else {
        throw new Error('No status of Request');
  
      }
  
  
    } else if(req.p2p.type === 1) {
      if(status === 2 &&( request.user.silver < request.silver || req.p2p.silver < request.silver)) {
        throw new Error('Silver Balance is Low');
      } else if(status === 2 && request.user.silver >= request.silver && req.p2p.silver >= request.silver) {
        req.p2p.silver = req.p2p.silver - parseFloat(request.silver);
        request.status = 2;
        request.user.silver = request.user.silver - parseFloat(request.silver);
        request.user.escrowSilver = request.user.escrowSilver + parseFloat(request.silver);
        req.p2p.openedOn = Date.now();
        promises.push(request.user.save())
        lolSocket.emit('user'+request.user._id);
  
        notification = {
          title: `${req.p2p.user.fullName} confirms the P2P Trade`,
          type: 5,
          sentTo: request.user,
          user: req.p2p.user._id,data: {requestId: request._id, p2pTradeId: req.p2p._id}  };
        save(req, res, next,promises,notification);
  
      } else if (status === 0) {
        request.status = 0;
        
        notification = {
          title: `${req.p2p.user.fullName} denied the P2P Trade`,
          type: 5,
          sentTo: request.user,
          user: req.p2p.user._id,data: {requestId: request._id, p2pTradeId: req.p2p._id}  };
        save(req, res, next,promises,notification);
  
      } else if (status === 3) {
        request.status = 3;
        req.p2p.paidOn = Date.now();
        
        notification = {
          title: `${req.p2p.user.fullName} sent the payment`,
          type: 5,
          sentTo: request.user,
          user: req.p2p.user._id ,data: {requestId: request._id, p2pTradeId: req.p2p._id}  };
        save(req, res, next,promises,notification);
  
      } else if (status === 4) {
        request.status = 4;
        req.p2p.confirmsOn = Date.now();
  
        request.user.escrowSilver = request.user.escrowSilver - parseFloat(request.silver);
        promises.push(request.user.save());
        lolSocket.emit('user'+request.user._id);
  
        req.p2p.user.silver = req.p2p.user.silver + parseFloat(request.silver);
        promises.push(req.p2p.user.save());
        promises.push(
          new Transaction({
            type: 2,
            subType: 1,
            tradeWith:request.user._id,
            user:  req.p2p.user._id,
            silver: {
              amount: request.silver,
              price: request.silver*req.silver,
            },
            closing: {
              silver: req.p2p.user.silver,
              balance: req.p2p.user.balance,
            },
            status: 1,
          }).save());
          promises.push(
            new Transaction({
              type: 2,
              subType: 2,
              tradeWith: req.p2p.user._id,
              user: request.user._id,
              silver: {
                amount: request.silver,
                price: request.silver*req.silver,
              },
              closing: {
                silver: request.user.silver,
                balance: request.user.balance,
              },
              status: 1,
            }).save());
        notification = {
          title: `${request.user.fullName} confirms the payment and releases the Silver`,
          type: 5,
          sentTo: request.user,
          user: req.p2p.user._id,data: {requestId: request._id, p2pTradeId: req.p2p._id}  };
        save(req, res, next,promises,notification);
  
      }else if (status === 5) {
        request.status = 5;
        request.tradeUserReviews = reviews;
        save(req, res, next,promises,notification);
      }else if (status === 6) {
        request.status = 6;
        request.userReviews = reviews;
        save(req, res, next,promises,notification);
      } else {
        throw new Error('No status of Request');
  
      }
  
  
    }else {
      throw new Error('No Type of P2P Trade');

    }
    
    
   
    } catch(e) {
      next(new BadRequestResponse(e.message, 422))
    
    }

    
});
const save = (req, res, next,promises,notification) => {
  promises.push(req.p2p.save());

Promise.all([...promises]).then(results => {
  lolSocket.emit('user'+req.p2p.user._id);
  lolSocket.emit('p2pTrade'+req.p2p._id);
  sendNotification(notification)
  next(new OkResponse({ ...results }));
})
}

// ------------------------ redeem voucher ------------
router.get(
  "/redeem/:voucherCode",
  auth.required,
  auth.user,
  silver,
   function (req, res, next) {
  
    Voucher.findOne({
      voucherCode: req.params.voucherCode,
      isDelete: false,
      validThru: { $gte : Date.now()}
    })
    .then((doc) => {
      if (!doc) {
        next(new BadRequestResponse('Voucher Code is invalid', 422.0))
      }
      else if(doc.usedBy) {
        // next(new BadRequestResponse('You already used this Voucher', 422.1))
        next(new BadRequestResponse('Voucher Code is invalid', 422.0))

      }
       else {
         
        doc.usedBy = req.user._id;
        req.user.silver=  req.user.silver + doc.silver;
        let transaction = new Transaction({ // update the friend
          type: 5,
          subType: 1,
          user: req.user._id,
          silver: {
            amount: doc.silver,
            price: doc.silver*req.silver,
          },
          closing: {
            silver: req.user.silver,
            balance: req.user.balance,
          },
          status: 1,
        })
        
        Promise.all([
          transaction.save(),
          doc.save(),
          req.user.save()
          // TODO system Cut here
        ]).then(d => {
          
          lolSocket.emit('user'+req.user._id);
        sendNotification( {
          title: `Voucher ${doc.voucherCode} successfully redeemed`,
          type: 1,
          sentTo: req.user._id,
          })

          next(new OkResponse({ message: 'Voucher redeem successfully' }));
        })
      }
    });
     
  });
module.exports = router;
