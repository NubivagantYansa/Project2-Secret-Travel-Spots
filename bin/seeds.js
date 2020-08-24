require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User.model");
//const Spot = require("../models/Spot.model");
console.log(process.env.DB_NAME);
// require database configuration
require("../configs/db.config");

// const users = [
//   {
//     username: "test",
//     email: "test@test.com",
//     passwordHash:
//       "$2a$10$YZbxJDIQx0df.lCGW8.6Lecu9ElmuksVrP9NJkftmWzIiEQw.4dvy",
//   },
// ];

// User.create(users)
//   .then((usersFromDB) => {
//     console.log(`Created ${usersFromDB.length} users`);
//     mongoose.connection.close();
//   })
//   .catch((err) =>
//     console.log(`An error occurred while creating users in the DB: ${err}`)
//   );

// // const spots = [
//   {
//     author: "AUTHOR",
//     name: "Punta Uvita",
//     description:
//       "Punta Uvita or the Whale Tail is a magical place to visit.  Some people have referred to this natural phenomenon as “Moses Passage” when at low tide the ocean recedes and a 600 meter long sand passage opens up.",
//     location: "Puntarenas Province, Uvita, Costa Rica",
//     category: "beach",
//     comments: 'comments',
//   },
// ];

// Spot.create(spots)
//   .then((spotsFromDB) => {
//     console.log(`Created ${spotsFromDB.length} spots`);
//     mongoose.connection.close();
//   })
//   .catch((err) =>
//     console.log(`An error occurred while creating spots in the DB: ${err}`)
//   );
