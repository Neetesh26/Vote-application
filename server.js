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

// const { jwtMiddleware } = require("./jwt");


//require page user route
const userRoutes = require('./Routes/userRoutes')
const candidateRoutes = require('./Routes/candidateRoutes')

// middleware use user route
app.use('/user', userRoutes)
app.use('/candidate', candidateRoutes)

app.listen(PORT, () => {
  console.log("Server listening on port : ", PORT);
});
