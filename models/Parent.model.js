const { Schema, model } = require("mongoose");

const parentSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: String,
    city: String,
    childName: { type: String, lowercase: true },
    child: { type: Schema.Types.ObjectId, ref: "Child" },
    childAge: Number,
    Relation: String,
    // posts: [{type: Schema.Types.ObjectId, ref: "Post"}]
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const Parent = model("Parent", parentSchema);

module.exports = Parent;