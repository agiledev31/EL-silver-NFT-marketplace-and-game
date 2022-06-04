require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID || "ACb452ad91ee5c04e260158dfbba2d333d";
const authToken = process.env.TWILIO_AUTH_TOKEN || "3bc40cf1d36169d84bff30bcc6a04a87";

// const sendSMSVerificationSuccess = ({ otp }) => {
//  }

const sendSMS_OTP = (req) => { 

  const client = require('twilio')(accountSid, authToken);
  client.messages
    .create({
      body: `${req.otp} is your ELSILVER OTP. Do not share the code with anyone else. `,
      from: '+13512474432',
      to: req.phone
    })
    .then(message => console.log(message.sid));
}

const sendSMSForgotPasswordSuccess = ({ otp }) => {
  const client = require('twilio')(accountSid, authToken);
  client.messages
    .create({
      body: `Your Password has been reset successfully. If not done by you Please Contact support. `,
      from: '+13512474432',
      to: req.phone
    })
    .then(message => console.log(message.sid)); }

module.exports = {
  // sendSMSVerificationOTP,
  //sendSMSVerificationSuccess,
  sendSMS_OTP,
  sendSMSForgotPasswordSuccess,
}