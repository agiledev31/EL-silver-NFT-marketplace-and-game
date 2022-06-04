const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const sgMail = require('@sendgrid/mail')
const smtpAuth = require("../config").smtpAuth;
sgMail.setApiKey("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")

const sendEmail = (mailDetails) => {

  const transporter = nodemailer.createTransport({
    service: 'Sendgrid',
    auth: smtpAuth,
  });

  // Open template file
  var source = fs.readFileSync(
    path.join(__dirname, "../templates/email.hbs"),
    "utf8"
  );

  // Create email generator
  var template = Handlebars.compile(source);
  sgMail
    .send({ ...mailDetails, html: template(mailDetails.templateObj) }, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent", info);
      }
    });
};

const sendEmailVerificationOTP = async (user) => {
  sendEmail({
    from: " ELSILVER Notification <info@laplata.me>",
    to: user.email,
    subject: "ELSilver Email Verification",
    templateObj: {
      ...user,
      emailText: `<p>Please verify that your email address is ${user.email} and that you entered it when signing up for ELSilver.</p>
       <p>Enter this OTP to complete the Signup.</p>`,
    },
  });
};

const sendEmailVerificationLink = async (user) => {
  let emailverificationLink = user.url + 'auth/email-verification/' + user.token;
  console.log("************  : ", emailverificationLink)
  sendEmail({
    from: " ELSILVER Notification <info@laplata.me>",
    to: user.email,
    subject: "ELSilver Email Verification",
    templateObj: {
      ...user,
      emailText: `<p>Please verify that your email address is ${user.email} and that you entered it when signing up for ELSilver.</p>
       <p>Click on this link to verify and login to your account.</p>
       <a href=${emailverificationLink} style="color:blue"><b>Verify Account</b></a>`

    },
  });
};

const sendEmailVerificationSuccess = async (user) => {
  sendEmail({
    from: " ELSILVER Notification <info@laplata.me>",
    to: user.email,
    subject: "Your Email verified successfully",
    templateObj: {
      ...user,
      emailText: `
      <h1>Welcome to ELSilver</h1>. <br>
        Your Email Address has been Verified Successfully. <br>
        <i>Let's Play</i>
      `,
    },
  });
};

const sendEmailOTP = async (user) => {
  sendEmail({
    from: " ELSILVER Notification <info@laplata.me>",
    to: user.email,
    subject: "Email Verification For New Password",
    templateObj: {
      ...user,
      emailText: `
      <p>We received an OTP request on your ELSILVER Account.</p>.
      <p>Enter this OTP to complete the process.</p>
      `,
    },
  });
};

const sendEmailLink = async (user) => {
  let emailverificationLink = user.url + 'auth/email-verification/' + user.token;
  console.log("************  : ", emailverificationLink)
  sendEmail({
    from: " ELSILVER Notification <info@laplata.me>",
    to: user.email,
    subject: "ELSilver Email Verification",
    templateObj: {
      ...user,
      emailText: `<p>Please verify that your email address is ${user.email} and that you entered it when signing up for ELSilver.</p>
       <p>Click on this link to verify and login to your account.</p>
       <a href=${emailverificationLink} style="color:blue"><b>Verify Account</b></a>`

    },
  });
}

const sendEmailForgotPasswordSuccess = async (user) => {
  sendEmail({
    from: " ELSILVER Notification <info@laplata.me>",
    to: user.email,
    subject: "Your Account's password has been reset",
    templateObj: {
      ...user,
      emailText: `
      Your Password for the ${user.email} has been reset successfully. <br>
      <i>Let's Play</i>
      `,
    },
  });
};

const sendEmailCreateAdmin = async (user) => {
  sendEmail({
    from: " ELSILVER Notification <info@laplata.me>",
    to: user.email,
    subject: "Your Admin Account is live",
    templateObj: {
      ...user,
      emailText: `
      Congratulations – your account is live and ready for action. You now have access to ELSilver admin.
      Your password for the ${user.email} need to be reset. <br>
      `,
    },
  });
};
module.exports = {
  sendEmailVerificationOTP,
  sendEmailVerificationSuccess,
  sendEmailOTP,
  sendEmailForgotPasswordSuccess,
  sendEmailCreateAdmin,
  // sendEmailForgotPasswordOTP,
  sendEmailVerificationLink,
  sendEmailLink
};
