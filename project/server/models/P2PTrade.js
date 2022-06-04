let mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
let P2PTradeSchema = new mongoose.Schema(
  {
    type: {
      type: Number,
      enum: [
        1, // Buy
        2, // Sell
      ],
    },
    silver: Number,
    margin: Number, // margin that the market
    Location: Number,
    paymentMethod: Number,
    description: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: Number,
      enum: [
        1, // OPEN for trade
        2, // Trade CLOSED
      ],
      default: 1,
    },
    requests: [{
        user:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
        silver: Number,
        priceWithMargin: Number,
        status: {
            type: Number,
            enum: [
              0, // reject the request
              1, // Pending for trade
              2, // Opened for Trade hold the silver in escrow
              3, // Paid for Trade 
              4, // Confirm for Trade // system make the transactions
              5,  // userReviews about the Trade
              6  // tradeUserReviews about the Trade

            ],
            default: 1,
          },
          userReviews: [], // who requests for the User 
          tradeUserReviews: [], //who owns this post trade.user
          startsOn: { type: Date,  },
          openedOn: { type: Date,  },
          paidOn: { type: Date,  },
          confirmsOn: { type: Date,  },
          createdAt: { type: Date, default: Date.now },
          
    }]
  },
  { timestamps: true }
);
P2PTradeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("P2PTrade", P2PTradeSchema);
