const axios = require('axios');
const {goldApiServerKey } =require('../config');

const silver = (req, res, next) => {
  axios
    .get("https://www.goldapi.io/api/XAG/USD/", {
      headers: {
        "x-access-token": goldApiServerKey,
      },
    })
    .then(function (response) {
      // here we receive price in USD/ounce.
      // by dividing on 31.1 we are converting this into USD/gram
      req.silver = response.data.price / 32.151;
      
      next();
    })
    .catch(next);
};


module.exports = {silver}