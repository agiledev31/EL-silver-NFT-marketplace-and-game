var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const GameSchema = new mongoose.Schema({
    gameType: mongoose.Schema.Types.String,
    gameDuration: mongoose.Schema.Types.String,
    result: {type: mongoose.Schema.Types.String, enum: ['Victory', 'Defeat']},
    KDA: mongoose.Schema.Types.String,
    champion: mongoose.Schema.Types.String,
    KDAStats: mongoose.Schema.Types.String,
    gameTimeStamp: mongoose.Schema.Types.Date,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    lolId: mongoose.Schema.Types.String,
    lolChallenge: {type: mongoose.Schema.Types.ObjectId, ref:'LOLChallenge'}
}, {timestamps: true});

GameSchema.index({lolChallenge: 1});
GameSchema.index({gameTimeStamp: 1});

GameSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Game', GameSchema);
