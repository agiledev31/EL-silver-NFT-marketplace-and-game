const mongoose = require('mongoose');
const moment = require('moment');
const SiteSettings = mongoose.model('LaplataSetting');
const Game = mongoose.model('Game');

async function calculate(numberOfGames, victories) {
  const settings = await SiteSettings.findOne();
  // const yesterday = moment().subtract(1, 'days');
  // UTC to GMT time problem
  const yesterStart = moment().subtract(2, 'days').startOf('day').toISOString();
  const yesterEnd = moment().subtract(2, 'days').endOf('day').toISOString();
  console.log('start', moment().subtract(1, 'days').startOf('day').toISOString());
  console.log('end', moment().subtract(1, 'days').endOf('day').toISOString());
  let result;
  try {
    // fetch all the games
    const games = await Game.find({
      gameTimeStamp: {
        $gte: yesterStart,
        $lt: yesterEnd,
      },
    }).count();
    console.log('games', games);
    console.log('perDay', settings.perDayDistribution);
    console.log('hardCap', settings.hardCap);
    console.log('incentive', settings.incentive);

    if (settings.incentive != 0) {
      result =
        numberOfGames * settings.perDayDistribution +
        (victories * settings.perDayDistribution * settings.incentive) / 100;
    } else {
      result = numberOfGames * settings.perDayDistribution;
    }

    if (result > settings.hardCap) {
      result = settings.hardCap;
    }
  } catch (e) {
    console.log('calculate', e);
    throw e;
  }
  return parseFloat(parseFloat(result).toFixed(1));
}

module.exports = {
  calculate,
};
