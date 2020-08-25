const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."], // it will disqualify all the emails with accidental empty spaces, missing dots in front of (.)com and the ones with no domain at all
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required."],
    },
    spots: [{ type: Schema.Types.ObjectId, ref: 'Spot' }]
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
