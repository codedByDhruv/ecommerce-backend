// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

// 🔒 Create a new category (Admin only)
router.post("/", protect, adminOnly, categoryController.create);

// 🔒 Update a category by ID (Admin only)
router.put("/:id", protect, adminOnly, categoryController.update);

// 🔒 Delete a category by ID (Admin only)
router.delete("/:id", protect, adminOnly, categoryController.remove);

// 🟢 Get all categories (Public)
router.get("/", categoryController.getAll);

// 🟢 Get categories based on filter query (Public)
router.get("/filter", categoryController.getFilteredCategories);

module.exports = router;
