var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


var LolChallengeSchema = new mongoose.Schema({
    clientId: mongoose.Schema.Types.String,
    region: mongoose.Schema.Types.String,
    gameStatistics: {
        total: {type: mongoose.Schema.Types.Number, default: 0},
        averageKDA: {type: mongoose.Schema.Types.Number, default:0},
        victories: {type: mongoose.Schema.Types.Number, default: 0},
        defeats: {type: mongoose.Schema.Types.Number, default: 0},
        startTime: mongoose.Schema.Types.Date,
        endTime: mongoose.Schema.Types.Date
    },
    games: [{type: mongoose.Schema.Types.ObjectId, ref: 'Game'}],
    rewardedLaplata: {type: mongoose.Schema.Types.Number, default:0},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    isFinished: {type:mongoose.Schema.Types.Boolean, default: false },
}, { timestamps: true });

LolChallengeSchema.plugin(mongoosePaginate);

LolChallengeSchema.index({user: 1});
LolChallengeSchema.index({clientId: 1});

module.exports = mongoose.model('LOLChallenge', LolChallengeSchema);