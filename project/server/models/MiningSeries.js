var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

let SeriesSchema = new mongoose.Schema({

    name: {
        type: String,
        default: "null"
    },
    startDate: mongoose.Schema.Types.Date,
    endDate: mongoose.Schema.Types.Date,
    poolprize: Number,
    prizedistribution: Array

}, { timestamps: true });


SeriesSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Series', SeriesSchema);