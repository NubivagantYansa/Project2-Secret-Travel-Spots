const express = require("express");
const router = express.Router();
const { isLoggedMiddleware } = require("../middlewares/middlewares");
const geocoder = require("../utils/geocoder");

const User = require("../models/User.model");
const Spot = require("../models/Spot.model");
const Comment = require("../models/Comment.model");

const fileUploader = require("../configs/cloudinary.config");

/*    CONTROLLERS     */

//  .To render all spots
const getAllSpots = (req, res) => {
  Spot.find()
    .populate("author")
    .sort({ createdAt: -1 })
    .limit(10)
    .then((spots) => {
      res.render("explore", { spots: spots });
    })
    .catch((err) => console.log(`error while getting the spots page ${err}`));
};
//  .To render one spot
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

/*   GET - render USER'S SPOTS page */
router.get("/user-spots", isLoggedMiddleware, (req, res, next) => {
  Spot.find({ author: req.session.currentUser._id })
    .populate("author")
    .then((spotsFromDb) => {
      console.log(`spots ${JSON.stringify(spotsFromDb, null, 4)} here`);
      res.render("user/user-spots", { spots: spotsFromDb });
    })
    .catch((err) =>
      console.log(`something happened while getting movies ${err}`)
    );
});

/*   GET - render CREATE NEW SPOT page   */
router.get("/create-spot", isLoggedMiddleware, (req, res) => {
  res.render("user/create-spot", { javascript: "createSpot" });
});

/*   POST - Upload image in Cloudinary  (CREATE NEW SPOT page) */
router.post(
  "/image-upload",
  isLoggedMiddleware,

  fileUploader.single("image"),
  (req, res) => {
    res.json(req.file);
  }
);

/*   POST - CREATE NEW SPOT (CREATE NEW SPOT page) */
router.post(
  "/create-spot",
  isLoggedMiddleware,

  (req, res) => {
    const { address, name, description, category, imageUrl } = req.body;

    console.log("this is req body", req.body);

    // if (!name || !description || !address) {
    //   res.json({
    //     errorMessage:
    //       "All fields are mandatory. Please provide name, descritpion, address and category!",
    //   });
    //   return;
    // }

    Spot.create({
      name,
      description,
      address,
      category,
      author: req.session.currentUser._id,
      imageUrl,
    })
      .then((newSpot) => {
        console.log("THIS IS NEW SPOT", newSpot);
        User.findByIdAndUpdate(
          req.session.currentUser._id,
          { $addToSet: { spots: newSpot._id } },
          { new: true }
        ).then((updatedUser) => {
          console.log(updatedUser);
          res.json({ path: "/user-profile" });
        });
      })
      .catch((err) => console.log(`error while creating a new spot ${err}`));
  }
);

/*  GET - render SPOT-details page  */
router.get("/user-spots/:spotId", getOneSpot);

/*  GET - render EDIT SPOT  page  */
router.get("/user-spots/:spotId/edit", isLoggedMiddleware, (req, res) => {
  const { spotId } = req.params;
  Spot.findById(spotId)
    .then((spotToEdit) => {
      console.log(spotToEdit);
      res.render("user/edit-spot", {
        javascript: "editSpot",
        spot: spotToEdit,
      });
    })
    .catch((err) =>
      console.log(`error while displaying spot edit page ${err}`)
    );
});

/*  POST -  EDIT SPOT details  */
router.post(
  "/user-spots/:spotId/edit",
  isLoggedMiddleware,
  // fileUploader.single("image"),
  (req, res) => {
    console.log("this is the body", req.body);
    const { spotId } = req.params;
    //console.log("this is the body", req.body);
    let { name, description, address, location, category, imageUrl } = req.body;

    // const data2 = Object.entries(req.body)
    //   .filter((element) => element[1])
    //   .reduce((acc, val) => ({ ...acc, [val[0]]: val[1] }), {});

    // validation for empty fields: No empty fields allowed
    // if (!name || !description || !address) {
    //   res.render("user/edit-spot", {
    //     errorMessage:
    //       "All fields are mandatory. Please provide name, descritpion, address and category!",
    //   });
    // }
    //   controls image in edit

    // if (req.file) {
    //   imageUrl = req.file.path;
    // } else {
    //   imageUrl = req.body.existingImage;
    // }

    //  transform address in coordinates
    location = geocoder.geocode(address).then((response) => {
      // format as a Point
      location = {
        type: "Point",
        coordinates: [response[0].longitude, response[0].latitude],
        formattedAddress: response[0].formattedAddress,
      };

      Spot.findByIdAndUpdate(
        spotId,
        { name, description, address, location, category, imageUrl },
        { new: true }
      )
        .then((response) => {
          console.log("this is response from edit", response);
          res.json({ path: "/user-profile/user-spots/" });
        })
        .catch((err) => console.log(`error while editing a spot ${err}`));
    });
  }
);

/*  POST - Delete a spot */
router.post(
  "/user-spots/:spotId/edit/delete",
  isLoggedMiddleware,
  (req, res) => {
    const { spotId } = req.params;
    Spot.findByIdAndDelete(spotId)
      .then(() => res.redirect("/user-profile/user-spots"))
      .catch((err) => console.log(`error while deleting a spot ${err}`));
  }
);

/*  GET -  render USER's favourite spots   */
router.get("/user-favourites", isLoggedMiddleware, (req, res, next) => {
  User.findById(req.session.currentUser._id)
    // ({author: req.session.currentUser._id})
    .populate("favSpots")
    // .populate({
    //   path: "favSpots",
    //   populate: {
    //     path: "author",
    //     model: "Spot",
    //   },
    // })
    .then((spotsFromDb) => {
      console.log(`spots ${JSON.stringify(spotsFromDb, null, 4)} here`);
      res.render("user/favourite-spots", { spots: spotsFromDb });
    })
    .catch((err) =>
      console.log(`something happened while getting movies ${err}`)
    );
});

/*  GET -  render favourite spot - spot's details   */
router.get("/user-favourites/:spotId", isLoggedMiddleware, getAllSpots);

/*  POST -  create new favourite spot   */
router.post("/spot-details/:spotId/fav", isLoggedMiddleware, (req, res) => {
  console.log("this is params", req.params);

  const { spotId } = req.params;
  User.findByIdAndUpdate(
    req.session.currentUser._id,
    { $addToSet: { favSpots: spotId } },
    { new: true }
  )
    .then((newUser) => {
      console.log(newUser);
      req.session.currentUser = newUser;
      res.redirect("/explore");
    })

    .catch((err) => console.log(`Error after creating the favourite: ${err}`));
});

/*    USER PROFILE OPTIONS -------------------- */

/*  GET - render EDIT USER PROFILE  */
router.get("/edit-profile", isLoggedMiddleware, (req, res) => {
  const userId = req.session.currentUser._id;
  User.findById(userId)
    .then((userToEdit) => {
      res.render("user/edit-profile", { user: userToEdit });
    })
    .catch((err) =>
      console.log(`error while displaying edit profile page ${err}`)
    );
});

/*  POST -  EDIT USER PROFILE  */
router.post("/edit-profile", isLoggedMiddleware, (req, res) => {
  const userId = req.session.currentUser._id;

  //validation for empty fields:
  //.1 No empty fields allowed
  // if (!username || !email) {
  //   res.render("/edit-profile", {
  //     errorMessage:
  //       "All fields are mandatory. Please provide your username, email and password.",
  //   });
  // }

  //.2 Do not update empty blanks (easy)
  // const data = {};
  // if (username) {
  //   data.username = username;
  // }
  // if (email) {
  //   data.email = email;
  // }

  //.3 Do not update empty blanks (hard-core)
  const data2 = Object.entries(req.body)
    .filter((element) => element[1])
    .reduce((acc, val) => ({ ...acc, [val[0]]: val[1] }), {});

  User.findByIdAndUpdate(userId, data2, { new: true })
    .then((response) => {
      req.session.currentUser = response;
      res.redirect("/user-profile");
    })
    .catch((err) => console.log(`error while editing user's profile ${err}`));
});

/*  POST -  DELETE USER PROFILE  */
router.post("/:userID/edit-profile/delete", isLoggedMiddleware, (req, res) => {
  const userId = req.session.currentUser._id;

  User.findByIdAndDelete(userId)
    .then((response) => {
      // alert(response.data);
      req.session.destroy();
      res.redirect("/signup");
    })
    .catch((err) => console.log(`error while deleting user ${err}`));
});

module.exports = router;
