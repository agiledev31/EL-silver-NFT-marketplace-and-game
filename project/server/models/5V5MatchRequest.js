let mongoose = require('mongoose');

let FiveV5MatchRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    team: [{ player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, playerType: { type: Number, enum: [-1,1, 2, 3, 4, 5] }, isCaptain: { type: Boolean, default: false } }],
    invites: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' },], // Team_B Participants  
    region: String,
    map: Number,
    status: {
        type: Number,
        default: 1, // default 1: Available for joining
        enum: [
            1, // 1: Available for Joining
            2  // 2: Full
        ]
    },
}, { timestamps: true });

module.exports = mongoose.model('FiveV5MatchRequest', FiveV5MatchRequestSchema);
