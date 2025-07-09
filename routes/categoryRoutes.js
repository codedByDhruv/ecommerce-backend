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

// 🟢 Get all categories (Admin only)
router.get("/", protect, adminOnly, categoryController.getAll);

module.exports = router;
