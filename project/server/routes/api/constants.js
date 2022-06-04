let router = require('express').Router();
let httpResponse = require('express-http-response');
const { enCOUNTRIES, koCOUNTRIES } = require('../../constants/countries')
const { enREGIONS, koREGIONS } = require('../../constants/regions')
const { enTOURNAMENT_STATUS, koTOURNAMENT_STATUS } = require('../../constants/tournamentStatus')
const { koPaymentMethods, enPaymentMethods } = require('../../constants/paymentMethods')
const Setting = require('../../models/SiteSettings');


let OkResponse = httpResponse.OkResponse;
router.get('/', async function (req, res, next) {
    const locale = req.locale.language;
    const systemSetting = await Setting.find();
    if (locale == 'ko') {
        next(new OkResponse({ 
            system: systemSetting[0].settings,
            countries: koCOUNTRIES,
            regions: koREGIONS,
            status: koTOURNAMENT_STATUS,
            paymentMethods:koPaymentMethods
        }));
    } else {
        next(new OkResponse({ 
            system: systemSetting[0].settings,
            countries: enCOUNTRIES,
            regions: enREGIONS,
            status: enTOURNAMENT_STATUS,
            paymentMethods:enPaymentMethods
        }));
    }
});
router.get('/region', function (req, res, next) {
    const locale = req.locale.language;
    if (locale == 'ko') {
        next(new OkResponse({ regions: koREGIONS }));
    } else {
        next(new OkResponse({ regions: enREGIONS }));
    }
});

router.get('/tournamentStatus', function (req, res, next) {
    const locale = req.locale.language;
    if (locale == 'ko') {
        next(new OkResponse({ status: koTOURNAMENT_STATUS }));
    } else {
        next(new OkResponse({ status: enTOURNAMENT_STATUS }));
    }
});


module.exports = router;
