var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

let LevelSchema = new mongoose.Schema({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    name: {
        type: String,
        default: "null"
    },

    minPoints: Number,
    commissionRate: Number,

}, { timestamps: true });


LevelSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Level', LevelSchema);