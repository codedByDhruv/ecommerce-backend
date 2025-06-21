// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.post("/", protect, adminOnly, categoryController.create);
router.put("/:id", protect, adminOnly, categoryController.update);
router.delete("/:id", protect, adminOnly, categoryController.remove);

router.get("/", categoryController.getAll);
router.get("/filter", categoryController.getFilteredCategories);

module.exports = router;
