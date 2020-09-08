const express = require("express");
const router = express.Router();
const Spot = require("../models/Spot.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");
const session = require("express-session");

//Middleware to check if user is logged in
const isLoggedMiddleware = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect("/login");
  }
  next();
};

// ==========================================================================

router.post("/spot-details/:spotId/comment", isLoggedMiddleware, (req, res) => {
  const { spotId } = req.params;
  const { content } = req.body;
  console.log(req.body);

  let newComment;
  newComment = new Comment({ author: req.session.currentUser._id, content });

  // 3. when new comment is created, we save it ...
  newComment
    .save()
    .then((dbComment) => {
      console.log("this is dbcomment", dbComment);
      // ... and push its ID in the array of comments that belong to this specific post
      // dbSpot.comments.push(dbComment._id);
      Spot.findByIdAndUpdate(
        spotId,
        { $addToSet: { comments: dbComment._id } },
        { new: true }
      )
        .then((updatedSpot) => {
          console.log("this is what i get after saving comment", updatedSpot);
          return res.redirect(`/spot-details/${updatedSpot._id}`);
        })
        .catch((err) =>
          console.log(`Error after creating the comment: ${err}`)
        );
    })

    .catch((err) => console.log(`Error after creating the comment: ${err}`));
});

//Delete a comment
router.post(
  "/spot-details/:commentId/comment/delete/:spotId",
  isLoggedMiddleware,
  (req, res) => {
    const { commentId, spotId } = req.params;
    const userId = req.session.currentUser._id;
    // console.log("current", userId);
    // console.log("comment id here", commentId);
    // console.log("author", author);

    Comment.findById(commentId)
      .then((response) => {
        console.log("response", response);
        if (userId.toString() !== response.author.toString()) {
          return Spot.findById(spotId).then((singleSpot) => {
            res.render("spot-details", {
              ...singleSpot.toJSON(),
              spotId: singleSpot._id,
              error: "You can't delete if you're not the author!",
            });
          });
        }
        Spot.findByIdAndUpdate(
          spotId,
          { $pull: { comments: commentId } },
          { new: true }
        ).then((singleSpot) => {
          Comment.findByIdAndDelete(commentId)
            .then(() => {
              console.log("singleSpot ", singleSpot);
              res.redirect(`/spot-details/${spotId}`);
            })
            .catch((err) =>
              console.log("error while redirecting to spot details", err)
            );
        });
      })
      .catch((err) =>
        console.log(`an error occurred while showing a spot ${err}`)
      );
  }
);

module.exports = router;
