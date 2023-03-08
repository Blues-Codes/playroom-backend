const { Schema, model } = require("mongoose");

const GameSchema = new Schema(
  {
    title: String,
    description: String,
    original_location: String,
    cover_image: String,
    Play_Link: String

  },
  {
    timeseries: true,
    timestamps: true,
  }
);

// const Games = model("Games", childSchema);

module.exports = GameSchema;