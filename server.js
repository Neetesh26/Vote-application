const express = require("express");
const app = express();
require('dotenv').config()

const db = require('./db')

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// log request
const logrequest=(req,res,next)=>{
  console.log(`[${new Date().toLocaleString()}] requested made to : ${req.originalUrl}`)
next()
}
app.use(logrequest)

//require page user route
const userRoutes = require('./Routes/userRoutes')

// middleware use user route
app.use('/user', userRoutes)

app.listen(PORT, () => {
  console.log("Server listening on port : ", PORT);
});
