const { Schema, model } = require("mongoose");

const gameSchema = new Schema(
  {
    title: String,
    description: String,
    original_location: String,
    cover_image: String,
    play_link: String

  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const Games = model("Games", gameSchema);

module.exports = Games;