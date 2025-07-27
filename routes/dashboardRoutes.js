// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

// 🔒 Dashboard summary (Admin only)
router.get("/summary", protect, adminOnly, dashboardController.getSummary);

// Add this route below the /summary one
router.get("/orders-chart", protect, adminOnly, dashboardController.getOrderChartData);


module.exports = router;
