// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone:    String,
  address1: String,
  role:     { type: String, enum: ["user", "admin"], default: "user" },
  otp:      String,
  otpExpires: Date,
});

module.exports = mongoose.model("User", userSchema);
