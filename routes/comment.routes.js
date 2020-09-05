const express = require("express");
const router = express.Router();
const { isLoggedMiddleware } = require("../middlewares/middlewares");
const Spot = require("../models/Spot.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");

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

router.post("/spot-details/:spotId/comment", isLoggedMiddleware, (req, res) => {
  const { spotId } = req.params;
  const { content } = req.body;
  console.log(req.body);

  let newComment;
  newComment = new Comment({ author: req.session.currentUser._id, content });

  //. when new comment is created, we save it ...
  newComment
    .save()
    .then((dbComment) => {
      console.log("this is dbcomment", dbComment);
      // ... and push its ID in the array of comments that belong to this specific post
      Spot.findByIdAndUpdate(
        spotId,
        { $addToSet: { comments: dbComment._id } },
        { new: true }
      )
        .then((updatedSpot) => {
          console.log("this is what I get after saving comment", updatedSpot);
          return res.redirect(`/spot-details/${updatedSpot._id}`);
        })
        .catch((err) =>
          console.log(`Error after creating the comment: ${err}`)
        );
    })

    .catch((err) => console.log(`Error after creating the comment: ${err}`));
});

/*  POST - Delete comment */
router.post(
  "/spot-details/:spotId/:commId/delete",
  isLoggedMiddleware,
  (req, res) => {
    console.log("REQ params from COMMENTS", req.params);
    const { commId } = req.params;

    //delete comment
    // Comment.findByIdAndDelete(commId)
    //   .then(() => res.redirect("spot-details"))
    //   .catch((err) => console.log(`error while deleting a comment ${err}`));
    //update spot
    //update user
  }
); //THIS IS AN EXTRA FEATURE // router.post( //   "/user-spots/:spotId/edit", //   isLoggedMiddleware, //   async (req, res) => { //     console.log("this is the body", req.body); //     const { spotId } = req.params; //     const data = Object.entries(req.body) //       .filter((element) => element[1]) //       .reduce((acc, val) => ({ ...acc, [val[0]]: val[1] }), {}); //     const { address } = data; //     let location; //     if (address) { //       location = await geocoder.geocode(address).then((response) => ({ //         type: "Point", //         coordinates: [response[0].longitude, response[0].latitude], //         formattedAddress: response[0].formattedAddress, //       })); //       data.location = location;

/*  POST -  EDIT comment  */ //     }
//     try {
//       const response = await Spot.findByIdAndUpdate(spotId, data, {
//         new: true,
//       });

//       console.log("this is response from edit", response);
//       return res.json({ path: "/user-profile/user-spots/" });
//     } catch (error) {
//       console.log(`error while editing a spot ${error}`);
//     }
//   }
// );

module.exports = router;
