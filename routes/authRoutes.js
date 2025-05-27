// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/send-otp", authController.sendOtp);
router.post("/reset-password", authController.resetPassword);
router.post("/change-password", protect, authController.changePassword);

module.exports = router;
