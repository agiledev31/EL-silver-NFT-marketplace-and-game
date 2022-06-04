let router = require('express').Router();
let mongoose = require('mongoose');
let Setting = mongoose.model('SiteSetting');
let { OkResponse, BadRequestResponse } = require('express-http-response');

// return all site settings in key:value form
router.get('/all', async function (req, res, next) {
    Setting.find()
        .then(function (setting) {
            if (!setting) {
                if (!setting) { return next(new BadRequestResponse("No Setting Found")); }
            }
            next(new OkResponse(setting));
        })
        .catch(next);
})

// updates settings
router.put('/update/:id', async function (req, res, next) {
    Setting.findById(req.params.id).then(function (s) {
        if (!s) { return next(new BadRequestResponse("Error Updating Settings")); }
        s.settings = req.body;
        return s.save().then(function () {
            next(new OkResponse("Setting Updated"));
        }).catch(next);
    })
})


module.exports = router;
