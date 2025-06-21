// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

// 🟢 Register a new user
router.post("/register", authController.register);

// 🟢 Login existing user and return token
router.post("/login", authController.login);

// 🟢 Send OTP to email (for password reset)
router.post("/send-otp", authController.sendOtp);

// 🟢 Verify OTP from email
router.post("/verify-otp", authController.verifyOtp);

// 🟢 Reset password using verified OTP
router.post("/reset-password", authController.resetPassword);

// 🟢 Authenticated user can change their password
router.post("/change-password", protect, authController.changePassword);

// 🟢 Update profile details (authenticated user)
router.put("/profile", protect, authController.updateProfile)

// 🔒 Admin-only route to get all users with their roles
router.get("/all", protect, adminOnly, authController.getAllUsersWithRole);

module.exports = router;
