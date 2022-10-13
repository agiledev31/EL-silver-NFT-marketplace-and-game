require('dotenv').config();
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/lolSilver', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).catch(err => {
  console.log(err.stack);
  process.exit(1);
})
  .then(() => {
    console.log("connected to db in development environment");
  });;

// User.collection.drop();
require('./models/User');
require('./models/SiteSettings');

const users = require('./seeder/users');
const {defaultSettings,
  systemBalanceAsset,
  systemSilverAsset,} = require('./seeder/setting');
const laplataSetting = require('./seeder/laplata-settings');

laplataSetting.setLaplataSettings()
  .then((d) => {
    console.log("Laplata settings validated");
  })
  .catch(e => {
    console.error("Error while setting laplata settings", e);
  });

// settings.map(async (s, index) => {
defaultSettings.save((err, result) => {
  err ? console.error(err) : console.log("SETTINGS DONE!");
});
systemBalanceAsset.save((err, result) => {
  err ? console.error(err) : console.log("BALANCE Asset DONE!");
});
systemSilverAsset.save((err, result) => {
  err ? console.error(err) : console.log("Silver Asset DONE!");
});

users.map(async (u, index) => {
  await u.save((err, result) => {
    if (err) {
      
    }
    if (index === users.length - 1) {
      console.log("DONE!");
    }
  });
});
