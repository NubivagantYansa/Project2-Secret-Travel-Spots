const mongoose = require("mongoose");
console.log(process.env.DB_NAME);

mongoose
  .connect(`mongodb://localhost/${process.env.DB_NAME}`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));
