const { Router } = require("express");
const router = new Router();
const bcryptjs = require("bcrypt");
const saltRounds = 10;
const User = require("../models/User.model");
const mongoose = require("mongoose");

// ============================/. SIGN UP ./=============================>

// .Display the signup form to users
router.get("/signup", (req, res) => res.render("auth/signup"));

// .Process form data
router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });
    return;
  }

  // strong password:
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        email,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      req.session.currentUser = userFromDB;
      console.log("Newly created user");
      res.redirect("/user-profile");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email need to be unique. Either username or email is already used.",
        });
      } else {
        next(error);
      }
    });
});

// ============================/. LOGIN ./========================================>

// .Display the login form to users
router.get("/login", (req, res) => res.render("auth/login"));

// .Process form data
router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both email and password to login.",
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Email is not registered. Try with another email.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/user-profile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

// ============================/. LOGOUT ./=======================================>

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/user-profile", (req, res, next) => {
  if (req.session.currentUser) {
    res.render("user/user-profile", {
      user: req.session.currentUser,
      javascript: "profile",
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
