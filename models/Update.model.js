const { Schema, model } = require("mongoose");

const updateSchema = new Schema(
  {
    child: {type: Schema.Types.ObjectId, ref: "Child"},
    gamesPlayed: [
        {
            game: {type: Schema.Types.ObjectId}, 
            time: Date
        }
    ],
        
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const Update = model("Update", updateSchema);

module.exports = Update;



// // parent getting updates

// const updateSchema = new Schema(
//   {
//       childName: String,
//       childAge: Number,
//       gamesPlayed: [String],
//       date: String,
//     updates: [{type: Schema.Types.ObjectId, ref: "Child"}]
//   },
//   {
//     timeseries: true,
//     timestamps: true,
//   }
// );

// const Update = model("Update", updateSchema);

// module.exports = Update;