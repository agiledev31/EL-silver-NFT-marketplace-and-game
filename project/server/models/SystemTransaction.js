let mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

let TransactionSchema = new mongoose.Schema({

    type: {type: Number, enum: [
        1, // Buy/sell
        2, // p2p
        3, // win/loss
        4, // sent/received
        5, // vouchers
        6 // Tournament Entry Fee
    ]},
    subType: {type: Number, default: 1, enum: [
        1, // when silver comes to account buy or received
        2, // when silver goes from account send or sell
    ]},
    tradeWith: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    silver: {
        amount: Number,
        price: Number,
    },
    closing: {
        silver: Number,
        balance: Number,
    },
    status: {type: Number, enum: [
        1, // confirm
        2, // pending
    ]},
  
}, { timestamps: true });
TransactionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('SystemTransaction', TransactionSchema);
