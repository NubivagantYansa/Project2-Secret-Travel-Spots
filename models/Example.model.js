const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const exampleSchema = new Schema(
  {
    name: String,
    lastName: String,
  },
  {
    timestamps: true
  }
);

module.exports = model('Example', exampleSchema);
