const mongoose = require('mongoose');

const LaplataSettingSchema = new mongoose.Schema({
    perDayDistribution: { type: mongoose.Schema.Types.Number, required: true },
    hardCap: { type: mongoose.Schema.Types.Number, required: true },
    incentive: { type: mongoose.Schema.Types.Number, required: true },
    minwithdrawal: { type: mongoose.Schema.Types.Number, required: true },
}, {timestamps: true});

module.exports = mongoose.model('LaplataSetting', LaplataSettingSchema);