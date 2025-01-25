require('dotenv').config();
const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
  // extract token from headers
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];  if (!token) return res.status(401).json({ error: "unauthorized" });
  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attatch user info to object
    req.user = decoded;  //user is anything
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "invalid token" });
  }
};

// generate token --->
const generatetoken = (userdata) => {
  return jwt.sign(userdata, process.env.JWT_SECRET);
};

module.exports = { jwtMiddleware, generatetoken };
