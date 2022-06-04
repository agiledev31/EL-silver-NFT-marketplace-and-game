const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


var WithdrawsSchema = new mongoose.Schema({
    method: mongoose.Schema.Types.String,
    status: {type: mongoose.Schema.Types.String, enum: ['Pending', 'Complete','Cancelled','Refund']},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    amount: {type: mongoose.Schema.Types.Number, validate: (value) => value >= 0 },
    address: mongoose.Schema.Types.String,
    fee: {type: mongoose.Schema.Types.Number, default: 0},
}, { timestamps: true });

WithdrawsSchema.plugin(mongoosePaginate);

WithdrawsSchema.index({amount : 1});
WithdrawsSchema.index({user: 1});

module.exports = mongoose.model("Withdraw", WithdrawsSchema);