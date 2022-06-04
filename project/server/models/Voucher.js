let mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

let VoucherSchema = new mongoose.Schema({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    silver: Number,
    voucherCode: {type: String, 
        required: [true, "can't be blank"],
        trim: true,
        unique: true, },
    validThru: Date,
    isDelete: {type: Boolean , default:false}, 
    usedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });
VoucherSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Voucher', VoucherSchema);