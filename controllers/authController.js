const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendOtp = require("../utils/sendOtp");

exports.register = async (req, res) => {
  try {
    const { username, email, password, phone, address1 } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPwd = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPwd,
      phone,
      address1,
    });

    res.status(201).json({ message: "User registered successfully", user: { email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, role: user.role, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendOtp(email, otp);
  res.json({ message: "OTP sent to email" });
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  res.json({ message: "Password reset successfully" });
};

exports.changePassword = async (req, res) => {
  console.log("req.user",req.user);
  const userId = req.user._id;
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(userId);
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password changed successfully" });
};
