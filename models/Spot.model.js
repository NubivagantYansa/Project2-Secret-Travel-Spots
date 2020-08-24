const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const spotSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    description: {
      type: String,
      required: [true, "Desccription is required."],
    },
    location: {
      type: String,
      // TBD
      //required: [true, "Location is required."],
    },
    category: {
      type: String,
      required: [true, "Desccription is required."],
    },
    comments: { type: Schema.Types.ObjectId, ref: "Comment" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Spot", spotSchema);
