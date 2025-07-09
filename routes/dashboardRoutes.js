// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

// 🔒 Dashboard summary (Admin only)
router.get("/summary", protect, adminOnly, dashboardController.getSummary);

module.exports = router;
