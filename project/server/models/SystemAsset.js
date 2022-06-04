let mongoose = require('mongoose');

let SystemAssetSchema = new mongoose.Schema({
    key: {
        type: String
    },
    value: {
        type: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('SystemAsset', SystemAssetSchema);