const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    mobile:{
        type:String,

    },
    address:{
        type:String,
        required:true
    },
    aadharCardnumber:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        required:true,
        type:String
    },
    role:{
        type:String,
        enum:['voter' , 'admin'], //enumerator
        default:'voter'
    },
    isvoted:{
        type:Boolean,
        default:false
    }
});


const user = mongoose.model("user", userSchema);
module.exports = user;
