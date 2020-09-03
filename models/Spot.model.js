const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const geocoder = require("../utils/geocoder");

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
    address: {
      type: String,
      required: [true, "Please add an address."],
    },
    //from mapbox
    location: {
      type: {
        type: String,
        enum: ["Point"],
        //required: true,
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
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
      required: [
        true,
        "Category is required, you must choose of the listed items",
      ],
    },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//. Geocode and create location
//.pre --> it happens before it is saved in the database
spotSchema.pre("save", async function (next) {
  const location = await geocoder.geocode(this.address);
  //format as a Point
  this.location = {
    type: "Point",
    coordinates: [location[0].longitude, location[0].latitude],
    formattedAddress: location[0].formattedAddress,
  };

  // Do not save address
  // this.address = undefined;
  next();
});

// spotSchema.pre("findOneAndUpdate", async function (next) {
//   const docToUpdate = await this.model.findOne(this.getQuery());
//   console.log("this is the schema test", docToUpdate);
//   //const location = await geocoder.geocode(this.address);
//   //format as a Point
//   docToUpdate.location = {
//     type: "Point",
//     coordinates: [2, 1],
//     formattedAddress: "ajdsklasdaklsd randooom",
//   };
//   docToUpdate.save();
//   // Do not save address
//   // this.address = undefined;
//   next();
// });

module.exports = model("Spot", spotSchema);
