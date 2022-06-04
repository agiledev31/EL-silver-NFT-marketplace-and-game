const LaplataSetting = require('../models/LaplataSetting');


async function setLaplataSettings() {
    const currentSettings = await LaplataSetting.findOne();
    //console.log(currentSettings === null);
    if (currentSettings === null) {
        console.log("Valid Laplata Settings not found, restoring to default settings");
        LaplataSetting.collection.drop();
        const defaultSettings = new LaplataSetting({
            perDayDistribution: 1,
            hardCap: 10,
            incentive: 10,
            minwithdrawal: 10,
        });
        await defaultSettings.save();
    }
}


module.exports = { setLaplataSettings };