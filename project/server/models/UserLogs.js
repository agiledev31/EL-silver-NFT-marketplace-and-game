let mongoose = require('mongoose');

let UserLogsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    requestType: {
        type: Number,
        enum: [1, 2, 3, 4, 5]
    },
    description: String

}, { timestamps: true });

module.exports = mongoose.model('UserLogs', UserLogsSchema);