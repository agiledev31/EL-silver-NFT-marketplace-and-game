var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

let MatchSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    // PlayerType Enum Description
    // 1: Top , 2: Mid , 3:Add Carry, 4: Jungle, 5: Support
    teamA: [{ player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, playerType: { type: Number, enum: [1, 2, 3, 4, 5] }, isCaptain: { type: Boolean, default: false } }], // Team_A participants  
    teamB: [{ player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, playerType: { type: Number, enum: [1, 2, 3, 4, 5] }, isCaptain: { type: Boolean, default: false } }], // Team_B Participants  
    status: {
        type: Number,
        default: 1, // default 1- in Progress
        enum: [
            1, // 1: In Progress
            2, // 2: Result completed (Win/Loss)
            3, // 3: Draw
            4, // 4: abandoned
            5  // 5: scheduled
        ]
    },
    matchType: { type: Number, enum: [1, 2, 3] }, // 1: Solo, 2: 5v5 , 3 : tournament

    roomName: String,
    roomPassword: String,

    
    entryFee: Number, // Entry Fee for match spelling mistake here
    region: String,
    winnerTeam: [{ player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, playerType: { type: Number, enum: [1, 2, 3, 4, 5] }, isCaptain: { type: Boolean, default: false } }] // Winner Team Users
}, { timestamps: true });

MatchSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Match', MatchSchema);