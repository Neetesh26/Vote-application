const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  aadharCardnumber: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    required: true,
    type: String,
  },
  role: {
    type: String,
    enum: ["voter", "admin"], //enumerator
    default: "voter",
  },
  isvoted: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(user.password, salt);
    user.password = hashpassword;
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatepassword) {
  try {
    const match = await bcrypt.compare(candidatepassword, this.password);
    return match;
  } catch (error) {
    throw error;
  }
};

const user = mongoose.model("user", userSchema);
module.exports = user;
