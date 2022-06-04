let mongoose = require('mongoose');

let MatchingSchema = new mongoose.Schema({
    top: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Top Particepent
    mid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // MID Particepent
    addCarry: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Add Carry Particepent
    jungle: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Jungle Particepent
    support: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Support Particepent

    region: String,
    // status of lobby
    status: {
        type: Number,
        default: 1, // default 1: Available for joining
        enum: [
            1, // 1: Available for Joining
            2  // 2: Full
        ]
    },
}, { timestamps: true });

module.exports = mongoose.model('Matching', MatchingSchema);
