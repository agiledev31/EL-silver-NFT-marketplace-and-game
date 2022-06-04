let router = require('express').Router();
let mongoose = require("mongoose");
let Setting = mongoose.model("SiteSetting");

getSystemSetting = (req, res, next) => {
    Setting.find({}, (err, systemSetting) => {
        //req.system = Object.fromEntries(systemSetting[0].settings);
        next();
    }).catch(next);
    
}

router.use('/api', getSystemSetting, require('./api'));

module.exports = router;
