const express = require("express");
const router = express();
//model =--> table
const User = require("../models/user");
const { jwtMiddleware, generatetoken } = require("../jwt");
const candidate = require("../models/candidate");

//check admin role
// const checkAdminRole = async (userId) => {
//   try {
//     const user = await User.findById(userId);
//     if(user.role === "admin"){
//       return true;
//     }      
//   } catch (error) {
//     return false;
//   }
// };

// Check admin role
const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user) {
      // console.log(`User found: ${user}`);
      console.log("User found: ");
      
      if (user.role === "admin") {
        return true;
      } else {
        console.log("User role is not admin: ");
        // console.log(`User role is not admin: ${user.role}`);
      }
    } else {
      console.log(`User not found with ID: ${userId}`);
    }
  } catch (error) {
    console.error(`Error finding user: ${error}`);
  }
  return false;
};
// Apply JWT middleware to protect the route
// router.use(jwtMiddleware);

//post route  to add candidate
router.post("/",jwtMiddleware, async function (req, res) {
  try {
     // Debugging statement
    // console.log(`req.user: ${JSON.stringify(req.user)}`);   

    if (!(await checkAdminRole(req.user))){
      return res.status(403).json({ message: "user does not have admin role" });
    }
    const data = req.body;

    const newcandidate = new candidate(data);

    // Await the save operation
    const datasaved = await newcandidate.save();
    console.log("data saved");

    // Send response back to client
    res.status(201).json({ message: "User created successfully", datasaved: datasaved });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//update candidate by user--->
router.put("/:candidateID",jwtMiddleware, async (req, res) => {
  try {
    console.log(`req.user: ${JSON.stringify(req.user)}`);  
    if (!(await checkAdminRole(req.user)))
      return res.status(403).json({ error: "user does not have admin role" });

    const candidateID = req.params.candidateID;
    const updateCandidate = req.body;
    const response = await candidate.findByIdAndUpdate(candidateID,updateCandidate,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!response) {
      return res.status(404).json({ error: "candidate not found" });
    }

    console.log("candidate data  updated");
    res.status(200).json({ message: "candidate  updated",response:response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});


//delete candidate
router.delete('/:candidateID',jwtMiddleware,async (req,res) =>{
try {
    if (!(await checkAdminRole(req.user)))
    return res.status(403).json({ error: "user does not have admin role" });
    
    const candidateID= req.params.candidateID;
    const response =await candidate.findByIdAndDelete(candidateID)
    if(!response){
      return res.status(404).json({error:"candidate not found"})
    }
    console.log("candidate deleted");
    res.status(200).json({message:"candidate deleted",response:response})
    
} catch (error) {
    console.log(error);
    res.status(500).json({error:"internal server error"})
}
}) 


//vote route
router.post('/vote/:candidateID' ,jwtMiddleware , async (req,res)=>{
    //user id ,candidate id
    const userID = req.user
    const candidateIDData = req.params.candidateID
  try {
     const candidateID = await candidate.findById(candidateIDData)
    if(!candidateID){
      return res.status(400).json({message:" candidate not found"})
    }

    const user  = await User.findById(userID)

    if(!user){
      return res.status(400).json({message:" user not found"})
    }
    if(user.role === "admin"){
       res.status(400).json({message:" admin can not give vote"})
    }
    if(user.isvoted){
      res.status(400).json({message:" you have already voted"})
    }

    candidateID.votes.push({ user: userID });
    candidateID.voteCount++;
    await candidateID.save();

    user.isvoted = true;
    await user.save();

    res.status(200).json({message:"vote recorded successfully"})

  } catch (error) {
    console.log(error);
    
    res.status(400).json({message:" internal server error"})
  }
})


//counting vote route
router.get('/vote/count',async (req,res)=>{

  try {
      const candidatedata = await candidate.find().sort({voteCount:'desc'})
      const voteRecord = candidatedata.map((data)=>{
        return { partyName : data.party , voteCount: data.voteCount}
      })

      res.status(200).json(voteRecord)
  
  } catch (error) {
    console.log(error);
    res.status(400).json({message:" internal server error"})
  }
})

  module.exports = router;
