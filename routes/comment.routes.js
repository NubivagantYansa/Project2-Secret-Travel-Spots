const express = require("express");
const router = express.Router();
const Spot = require("../models/Spot.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");

router.post("/spot-details/:spotId/comment", (req, res) => {
  const { spotId } = req.params;
  const { content } = req.body;
  console.log(req.body);

  let user;

  User.findOne({ username: req.session.currentUser._id })
    .then((userDocFromDB) => {
      user = userDocFromDB;
      // if commenter is not user yet, redirect to login
      // if (!userDocFromDB) {
      //   return res.redirect("/");
      // }
    })
    .then(() => {
      // prettier-ignore
      Spot.findById(spotId)
      .then(dbSpot => {
        let newComment;
          newComment = new Comment({ author: req.session.currentUser._id, content });

        // 3. when new comment is created, we save it ...
        newComment
        .save()
        .then(dbComment => {
        console.log('this is dbcomment', dbComment)
          // ... and push its ID in the array of comments that belong to this specific post
          dbSpot.comments.push(dbComment._id);

          // 4. after adding the ID in the array of comments, we have to save changes in the post
          dbSpot
            .save()       // 5. if everything is ok, we redirect to the same page to see the comment
            .then(updatedSpot => {
              console.log('this is what i get after saving comment', updatedSpot)
              return res.redirect(`/spot-details/${updatedSpot._id}`)})
            // .catch((err) => console.log(`Error after creating the comment: ${err}`));
        });
      });
    })
    .catch((err) => console.log(`Error after creating the comment: ${err}`));
});
//if I use the if statement, it shows this error. otherwise it works (I cannot comment)
//what if we dom manipulation to show the comment section only if you're logged in? You can't comment any if you're not
// Error after creating the comment: Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

module.exports = router;
