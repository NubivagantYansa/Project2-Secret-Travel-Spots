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
      required: [true, "Description is required."],
    },
    location: {
      type: String,
      // TBD
      //required: [true, "Location is required."],
    },
    category: {
      type: String,
      enum: [
        "Beach",
        "To relax",
        "To eat",
        "To walk",
        "To bike",
        "To hike",
        "To visit",
        "For sunset",
        "For sunrise",
      ],
      required: [true, "Category is required, and you must choose of these"],
    },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Spot", spotSchema);
