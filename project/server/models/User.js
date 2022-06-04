let mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
let crypto = require("crypto");
let jwt = require("jsonwebtoken");
let secret = require("../config").secret;

let faker = require("faker");
const mongoosePaginate = require("mongoose-paginate-v2");
let UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: false,
      required: [true, "can't be blank"],
      trim: true,
      index: true,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
    },
    googleAuthToken: { type: String, default: null },

    inActiveReason: { type: String, default: null },
    status: {
      type: Number,
      default: 1, // default 1- Active
      enum: [
        1, // 1: Active
        2, // 2: Inactive
      ],
    },

    role: {
      type: Number,
      default: 1, // default 1- User
      enum: [
        1, // 1: user
        2, // 2: Super Admin
        3, // 3: Admin
      ],
    },

    // Points for Level
    userPoints: {
      type: Number,
      default: 0
    },

    fullName: { type: String, required: [true, "can't be blank"] },
    image: String,

    isOnline: { type: Boolean, default: false },

    referralcode: {
      type: String,
      default: null,
    },

    referrercode: {
      type: String,
      default: null,
    },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    token: { type: String, default: null },
    tokenExpires: { type: Date, default: null },
    isEmailVerified: { type: Boolean, default: false },

    escrowSilver: { type: Number, default: 0 },
    silver: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },

    // to save IDs of matches Played by User
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],
    tournaments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tournament" }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Laplata Statistics
    laplataBalance: { type: Number, default: 0 },
    laplataWithdrawn: { type: Number, default: 0 },

    hash: String,
    salt: String,
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });
UserSchema.plugin(mongoosePaginate);
UserSchema.methods.validPassword = function (password) {
  let hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

UserSchema.methods.setOTP = function () {
  this.otp = faker.random.number({ max: 9999, min: 999 });
  this.otpExpires = Date.now() + 3600000; // 1 hour
};

UserSchema.methods.generateReferralCode = function () {
  this.referralcode = faker.random.alphaNumeric(8);
};

UserSchema.methods.applyReferralCode = function (referrercode) {
  this.referrercode = referrercode;
};

UserSchema.methods.generateJWT = function () {
  let today = new Date();
  let exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000),
    },
    secret
  );
};

UserSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    username: this.username,
    email: this.email,
    phone: this.phone,
    fullName: this.fullName,
    image:
      this.image || "https://static.productionready.io/images/smiley-cyrus.jpg",
    role: this.role,
    token: this.generateJWT(),
    isOnline: true,
    silver: this.silver,
    balance: this.balance,
    referralcode: this.referralcode,
    referrercode: this.referrercode,
  };
};

module.exports = mongoose.model("User", UserSchema);
