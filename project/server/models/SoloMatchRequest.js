let mongoose = require('mongoose');

let SoloMatchRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    positions: [],
    region: String,
    status: {
        type: Number,
        default: 1, // default 1: Available for joining
        enum: [
            1, // 1: Available for Joining
            2  // 2: Full
        ]
    },
}, { timestamps: true });

module.exports = mongoose.model('SoloMatchRequest', SoloMatchRequestSchema);
