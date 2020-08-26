// const express = require("express");
// const router = express.Router();
// const User = require("../models/User.model");
// const Spot = require("../models/Spot.model");

// // .Middleware to render all spots
// const getAllSpots = (req, res) => {
//   Spot.find()
//     .populate("author")
//     .then((spots) => {
//       res.render("explore", { spots: spots });
//     })
//     .catch((err) => console.log(`error while getting the spots page ${err}`));
// };

// // .Middleware to render all spots
// const getOneSpot = (req, res) => {
//   console.log(req.params);
//   const { spotId } = req.params;
//   Spot.findById(spotId)
//     .populate("author")
//     .then((singleSpot) => {
//       console.log(`one spot is showing ${singleSpot}`);
//       res.render("spot-details", singleSpot);
//     })
//     .catch((err) =>
//       console.log(`an error occurred while showing a spot ${err}`)
//     );
// };
