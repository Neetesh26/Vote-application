// install mongoose npm i mongoose
const mongoose = require("mongoose");
// const { user } = require("./Routes/userRoutes");
require('dotenv').config()

// define the db connection  url
const mongoUrl = 'mongodb://localhost:27017/voting'; // voting is the name of new database

// set up connect in db
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// get default  connection mongoose connection-->
const db = mongoose.connection;

// define event listner in db
db.on("connected", () => {
  console.log("connected to mongodb server");
});
db.on("disconnected", () => {
  console.log("disconnected to mongodb server");
});
db.on("error", (err) => {
  console.log("connected error to mongodb server", err);
});

module.exports = db;
