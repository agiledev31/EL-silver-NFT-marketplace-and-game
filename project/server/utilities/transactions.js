let mongoose = require("mongoose");

let User = mongoose.model("User");
let SystemAsset = mongoose.model("SystemAsset");
let Transaction = mongoose.model("SystemTransaction");

addTransaction = async (user, silver, silverPrice) => {
    // update user 
    // update system asset 
    user.silver = user.silver - silver;
    const savedUser = await user.save();
    const systemSilverAsset = await SystemAsset.findOneAndUpdate(
        { key: "silver" },
        { $inc: { value: + silver } }
      );
      const transaction = await Transaction({
        type: 6,
        subType: 1,
        tradeWith: null,
        user: user,
        silver: {
          amount: silver,
          price: silver*silverPrice,
        },
        closing: {
          silver: user.silver,
          balance: user.balance,
        },
        status: 1,
      }).save();
}

module.exports = {addTransaction}