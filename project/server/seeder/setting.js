const Setting = require('../models/SiteSettings');
let SystemAsset = require('../models/SystemAsset');

let defaultSettings = new Setting();
defaultSettings.settings = {
    "solo": 10,
    "fiveV5": 10,
    "winPoint": 20,
    "losePoint": 15,
    "sendSilverFee": 0.0015
};
const systemBalanceAsset = new SystemAsset({ key: "balance", value: 0 });
const systemSilverAsset = new SystemAsset({ key: "silver", value: 0 });

module.exports = {defaultSettings,
    systemBalanceAsset,
    systemSilverAsset,};