const express = require('express');
const router = express();
//model =--> table
const user = require("../models/user");
const { jwtMiddleware, generatetoken } = require("../jwt");



router.post("/signup", async function (req, res) {
  try {
    const data = req.body;

    const newUser = new user(data);

    // Await the save operation
    const datasaved = await newUser.save();
    console.log("data saved");

    //send data in payload to generate token
    const payload = {
      id: datasaved.id,
    };
    console.log(JSON.stringify(payload));

    const token = generatetoken(datasaved.id);
    console.log("token is : ", token);

    // Send response back to client
    res.status(201).json({message: "User created successfully",user: datasaved,token: token});
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async function (req, res) {
  try {
    const { aadharCardnumber, password } = req.body;

    const User = await user.findOne({ aadharCardnumber: aadharCardnumber });

    if (!User || !(await User.comparePassword(password))) {
      return res.status(401).json({ error: "invalid username or password" });
    }

    const payload = {
      id: User.id,
    };
    const token = generatetoken(payload);
    res.status(200).json({ token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

router.get("/profile", jwtMiddleware, async (req, res) => {
  try {
    const userdata = req.user;
    // console.log("userdata", userdata);
    const userId = userdata.id;
    const user = await user.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

//update password by user--->
router.put("/profile/password", jwtMiddleware, async (req, res) => {
  try {
    const userId  = req.user.id;
    const {currentpassword , newPassword}  = req.body;
    const user = await user.findById(userId)

    if(!(await user.comparePassword(currentpassword)))
      return res.status(401).json({ error: "invalid password" })

    // password updated
    user.password = newPassword
    await user.save()

    console.log("password updated");
    res.status(200).json({message: "password updated"})
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});


module.exports = router;
