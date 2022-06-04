const router = require("express").Router();
const mongoose = require("mongoose");
const Withdraw = mongoose.model('Withdraw');
const User = mongoose.model('User');
const ethereum_address = require('ethereum-address');

let auth = require('../auth');
let {
    OkResponse,
    BadRequestResponse,
    UnauthorizedResponse,
  } = require("express-http-response");

router.get('/',auth.required, auth.user, async (req,res, next) => {
    const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        sort: { createdAt: -1 },
    };
    try {
        const results = await Withdraw.paginate({user: mongoose.Types.ObjectId(req.user._id)}, options);
        console.log(results);
        next(new OkResponse(results));
    } catch (e) {
        console.error("Error in getting withdrawals ", e);
        next(new BadRequestResponse("Server Error"));
    }
});

router.post('/transaction', auth.required, auth.user, async (req, res, next) => {
    try {
        req.body.user = req.user._id;
        const newTransaction = new Withdraw(req.body);
        const user = await User.findById(req.user._id);
        user.laplataBalance = user.laplataBalance - newTransaction.amount;
        if (user.laplataBalance >= 0) {
            await newTransaction.save();
            user.laplataWithdrawn = user.laplataWithdrawn + newTransaction.amount;
            await user.save();
            next(new OkResponse(newTransaction));
        } else {
            next (new BadRequestResponse("Not enough balance to withdraw"))
        }
        
    } catch (e) {
        console.error("Error in creating a withdrawal request ", e);
        next(new BadRequestResponse("Server Error"));
    }
});

router.post('/validateAddress', auth.required, auth.user, async (req, res, next) => {

    
    const ethaddress=req.body.address
    if (ethereum_address.isAddress(ethaddress)) {
        console.log('Valid ethereum address.');
        next(new OkResponse('1'));
    }
    else {
        console.log('Invalid Ethereum address.');
        next(new OkResponse('0'));
    }
});

module.exports = router;