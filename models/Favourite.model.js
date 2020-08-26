const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const favouriteSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    favSpots: [{ type: Schema.Types.ObjectId, ref: "Spot" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Favourite", favouriteSchema);
