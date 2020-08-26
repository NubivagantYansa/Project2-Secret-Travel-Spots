const express = require("express");
const router = express.Router();
const Spot = require("../models/Spot.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");

router.post("/spot-details/:spotId/comment", (req, res) => {
  const { spotId } = req.params;
  const { author, content } = req.body;
  console.log(req.body);

  let user;

  User.findOne({ username: author })
    .then((userDocFromDB) => {
      user = userDocFromDB;

      // 1. if commenter is not user yet, let's register him/her as a user
      if (!userDocFromDB) {
        res.redirect("/");
      }
    })
    .then(() => {
      // prettier-ignore
      Spot.findById(spotId)
      .then(dbPost => {
        let newComment;

          newComment = new Comment({ author: user._id, content });


        // 3. when new comment is created, we save it ...
        newComment
        .save()
        .then(dbComment => {
        console.log('this is dbcomment', dbComment)
          // ... and push its ID in the array of comments that belong to this specific post
          dbPost.comments.push(dbComment._id);

          // 4. after adding the ID in the array of comments, we have to save changes in the post
          dbPost
            .save()       // 5. if everything is ok, we redirect to the same page to see the comment
            .then(updatedSpot => res.redirect(`/spot-details/${updatedSpot._id}`))
        });
      });
    })
    .catch((err) => console.log(`Error while creating the comment: ${err}`));
});

module.exports = router;
