const mongoose = require("mongoose");
const gameList = require("./gameListSeed.json");
const Games = require("./models/Games.model");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then((x) => {
    gameList.forEach((game) => {
      Games.create({
        title: game.title,
        description: game.description,
        original_location: game.original_location,
        cover_image: game.cover_image,
        play_link: game.play_link,
        playable: game.playable
      }).then((gamesCreated) => {
        console.log(gamesCreated);
      });
    });
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });