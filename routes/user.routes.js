const express = require('express');
const router  = express.Router();

// const bcryptjs = require('bcryptjs');
// const saltRounds = 10;
const User = require('../models/User.model');
const Spot = require('../models/Spot.model')
// const Comment = require('../models/Comment.model')
// const mongoose = require('mongoose');


//showing all user's spots
router.get("/user-profile/my-spots", (req,res,next) => {
    Spot.find()
    // ({author: req.session.currentUser._id})
    // .populate('author')
    .then(spotsFromDb => {
        console.log(`spots ${spotsFromDb} here`)
        res.render("user/user-spots", {spots: spotsFromDb})
    })
    .catch((err) => console.log(`something happened while getting movies ${err}`))
})

//showing create new spot page
router.get("/user-profile/create-spot", (req,res) => {
  if(req.session.currentUser) {
    res.render("user/create-spot")
  } else {
    res.redirect("/login");
  }
})

//creating a new spot
router.post("/user-profile/create-spot", (req,res) => {
  if(req.session.currentUser) {
    const {name, description, location, category} = req.body;
    Spot.create({name, description, location, category})
    .then(res.redirect('/user-profile'))
    .catch((err)=> console.log(`error while creating a new spot ${err}`))
  } else {
    res.redirect("/login");
  }
})

//showing a single spot from my spots
router.get('/user-profile/my-spots/:spotId', (req,res,next) => {
    const {spotId} = req.params;
    Spot.findById(spotId)
    .then(c => {
        console.log(`one spot is showing ${singleSpot}`)
        res.render('spot-details', singleSpot)
    })
    .catch((err) => console.log(`an error occurred while showing a spot ${err}`))
}) 

//show page to edit or delete a spot
router.get('/user-profile/my-spots/:spotId/edit', (req,res)=> {
  if(req.session.currentUser) {
    const {spotId} = req.params
    Spot.findById(spotId)
    .then(spotToEdit => {
        res.render("user/edit-spot", spotToEdit);
    })
    .catch(err => console.log(`error while displaying spot edit page ${err}`))
  } else{
    res.redirect("/login")
  }
})

//editing a spot
router.post('/user-profile/my-spots/:spotId/edit', (req,res) => {
  if(req.session.currentUser) {
    const {spotId} = req.params;
    const {name, description, location, category} = req.body;
    Spot.findByIdAndUpdate (
        spotId,
        {name, description, location, category},
        {new:true}
    )
    .then(() => res.redirect('/user-profile/my-spots/'))
    .catch((err) => console.log(`error while editing a spot ${err}`))
  } else {
    res.redirect("/login")
  }
})

//deleting a spot
router.post('/user-profile/my-spots/:spotId/edit/delete', (req,res) => {
  if(req.session.currentUser) {
    const {spotId} = req.params
    Spot.findByIdAndDelete(spotId)
    .then(() => res.redirect('/user-profile/my-spots'))
    .catch(err => console.log(`error while deleting a spot ${err}`))
  }else {
    res.redirect("/login")
  }
})

//show page to edit profile
router.get('/user-profile/edit-profile', (req,res)=> {
  if(req.session.currentUser) {
    const {userId} = req.params
    User.findById(userId)
    .then(userToEdit => {
        res.render("user/edit-profile", userToEdit);
    })
    .catch(err => console.log(`error while displaying edit profile page ${err}`))
  } else{
    res.redirect("/login")
  }
})

//editing user's profile
router.post('/user-profile/edit-profile', (req,res) => {
  if(req.session.currentUser) {
    const {userId} = req.params;
    const {username, email, password} = req.body;
    User.findByIdAndUpdate (
        userId,
        {username, email, password},
        {new:true}
    )
    .then(() => res.redirect('/user-profile/'))
    .catch((err) => console.log(`error while editing user's profile ${err}`))
  } else {
    res.redirect("/login")
  }
})

//deleting user's profile
router.post('/user-profile/:userID/edit-profile/delete', (req,res) => {
  if(req.session.currentUser) {
    const {userId} = req.params
    User.findByIdAndDelete(userId)
    .then(() => res.redirect('/signup'))
    .catch(err => console.log(`error while deleting user ${err}`))
  }else {
    res.redirect("/login")
  }
})

module.exports = router;