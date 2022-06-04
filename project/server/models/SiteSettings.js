let mongoose = require('mongoose');

let SiteSettingSchema = new mongoose.Schema({
    settings: {
        type: Map,
        of: String
    },
    // key: {
    //     type: String
    // },
    // value: {
    //     type: String
    // }
}, { timestamps: true });

module.exports = mongoose.model('SiteSetting', SiteSettingSchema);