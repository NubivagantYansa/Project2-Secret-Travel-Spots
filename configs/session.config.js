
//require session
const session = require("express-session");

//require MongoStore and mongoose
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");

module.exports = (app) => {
  // use session
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 120000, // 2 * 60 * 1000 ms === 2 min
      },
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        // ttl => time to live
        ttl: 60 * 60 * 24, // 60sec * 60min * 24h => 1 day
      }),
    })
  );
};
