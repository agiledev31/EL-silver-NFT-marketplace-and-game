let mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

let TournamentSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String, //tournament Title/Name
    entryFee: Number, // entry Fee of Tournament
    maxTeams: Number, // Maximum Number of teams allowed in Tournament
    region: Number, // Country of Tournament for which country/region it is allowed
    status: {
      type: Number,
      default: 1, // default 1: Up Coming
      enum: [
        1, // 1: up coming
        2, // 2: Ongoing
        3, // 3: Closed / Completed
        4, // 4: abandoned
      ],
    },
    coverImage: String,
    prize: Number,
    startDate: Date, // starting date of tournament
    endDate: Date, // date when tournaments ends
    games: [ {match:{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }, level: Number}], // array of matches that will be/ were part of Tournament
    // PlayerType Enum Description
    // 1: Top , 2: Mid , 3:Add Carry, 4: Jungle, 5: Support
    winnerTeam: [
      {
        player: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        playerType: { type: Number, enum: [1, 2, 3, 4, 5] },
      },
    ], // Winner Team Users
    teams: [
      {
        teamName: String,
        players: [
         {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            entryFeeStatus: { type: Number, enum: [0, 1] },}
        ],
      },
    ], // 0 Not Paid, 1 Paid
  },
  { timestamps: true }
);

TournamentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Tournament", TournamentSchema);
