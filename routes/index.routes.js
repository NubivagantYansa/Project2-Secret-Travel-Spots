const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Spot = require("../models/Spot.model");
const { create } = require("../models/User.model");

// .Controller to render all spots
const getAllSpots = (req, res) => {
  Spot.find()
    .populate("author")
    // .sort({ createdAt: -1 })
    // .limit(10)
    .then((spots) => {
      res.render("explore", { spots: spots, javascript: "explore" });
    })
    .catch((err) => console.log(`error while getting the spots page ${err}`));
};

// .Controller to render one spot
const getOneSpot = (req, res) => {
  console.log(req.params);
  const { spotId } = req.params;
  Spot.findById(spotId)
    .populate("comments author")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        model: "User",
      },
    })
    .then((singleSpot) => {
      console.log(`one spot is showing ${singleSpot}`);
      res.render("spot-details", singleSpot);
    })
    .catch((err) =>
      console.log(`an error occurred while showing a spot ${err}`)
    );
};

/* GET home page */
router.get("/", (req, res, next) => res.render("index"));

/* GET the about page */

router.get("/about", (req, res, next) => res.render("about"));

/* GET Explore page */
router.get("/explore", getAllSpots);

/* GET spot details page */
router.get("/spot-details/:spotId", getOneSpot);

router.get("/explore/search", (req, res, next) => {
  Spot.find()
    .populate("author")
    .then((spots) => {
      res.json(spots);
    })
    .catch((err) => console.log(`error while getting the spots page ${err}`));
});

//res.json

module.exports = router;
