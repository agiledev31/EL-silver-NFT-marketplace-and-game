const router = require('express').Router();
const mongoose = require('mongoose');
const Withdraw = mongoose.model('Withdraw');
const User = mongoose.model('User');

let auth = require('../../auth');
let { OkResponse, BadRequestResponse, UnauthorizedResponse } = require('express-http-response');

router.get('/', auth.required, auth.admin, async (req, res, next) => {
  const options = {
    page: req.query.page || 1,
    limit: req.query.limit || 10,
    sort: { createdAt: -1 },
    lean: true,
    populate: ['user'],
  };
  const query = {};
  if (req.query.status) {
    query.status = req.query.status;
  }
  if (req.query.status === 'All') {
    delete query.status;
  }
  console.log(query);
  try {
    const results = await Withdraw.paginate(query, options);
    next(new OkResponse(results));
  } catch (e) {
    console.error('Error in getting withdrawals ', e);
    next(new BadRequestResponse('Server Error'));
  }
});

router.patch('/', auth.required, auth.admin, async (req, res, next) => {
  const updateIds = req.body.withdrawals;
  const status = req.body.status;
  try {
    const updates = await Withdraw.updateMany({ _id: { $in: updateIds } }, { $set: { status: status } });
    return next(new OkResponse('Updated successfully'));
  } catch (e) {
    console.error('Error while updating Withdrawals');
    return next(new BadRequestResponse('Server Error'));
  }
});

// create refund requests for the following transaction ids TODO:
router.post('/refund', auth.required, auth.user, async (req, res, next) => {
  try {
    const updateIds = req.body.withdrawals;
    const status = req.body.status;
    const updates = await Withdraw.updateMany({ _id: { $in: updateIds } }, { $set: { status: status } });

    const refunddetails = await Withdraw.find({ _id: { $in: updateIds } });
    console.log('############################################');
    console.log(refunddetails);
    console.log('############################################');

    for (const eid of refunddetails) {
      let refundentry = {};
      refundentry.user = eid.user;
      refundentry.method = eid.method;
      refundentry.amount = eid.amount;
      refundentry.fee = eid.fee;
      refundentry.address = eid.address;
      refundentry.status = 'Refund';
      console.log('############################################');
      console.log('refundentry', refundentry);
      console.log('############################################');

      const newTransaction = new Withdraw(refundentry);
      await newTransaction.save();

      const user = await User.findById(refundentry.user);
      console.log('############################################');
      console.log('userx', user);
      console.log('############################################');

      user.laplataBalance = user.laplataBalance + newTransaction.amount;
      user.laplataWithdrawn = user.laplataWithdrawn - newTransaction.amount;
      await user.save();
    }

    return next(new OkResponse('Updated successfully'));
  } catch (e) {
    console.error('Error in creating a Refund request ', e);
    next(new BadRequestResponse('Server Error'));
  }
});

router.get('/all', auth.required, auth.admin, async (req, res, next) => {
  try {
    const result = await Withdraw.find().populate('user').lean(true);
    return next(new OkResponse(result));
  } catch (e) {
    console.error('Error while getting all Withdrawals');
    return next(new BadRequestResponse('Server Error'));
  }
});
router.get('/downloadRefunded', auth.required, auth.admin, async (req, res, next) => {
  try {
    const result = await Withdraw.find({ status: 'Refund' }).populate('user').lean(true);
    return next(new OkResponse(result));
  } catch (e) {
    console.error('Error while getting all Withdrawals');
    return next(new BadRequestResponse('Server Error'));
  }
});
router.get('/downloadCancelled', auth.required, auth.admin, async (req, res, next) => {
  try {
    const result = await Withdraw.find({ status: 'Cancelled' }).populate('user').lean(true);
    return next(new OkResponse(result));
  } catch (e) {
    console.error('Error while getting all Withdrawals');
    return next(new BadRequestResponse('Server Error'));
  }
});
router.get('/downloadComplete', auth.required, auth.admin, async (req, res, next) => {
  try {
    const result = await Withdraw.find({ status: 'Complete' }).populate('user').lean(true);
    return next(new OkResponse(result));
  } catch (e) {
    console.error('Error while getting all Withdrawals');
    return next(new BadRequestResponse('Server Error'));
  }
});
module.exports = router;
