// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

// 🔒 Create a new product with images (Admin only)
router.post("/", protect, adminOnly, upload.array("images"), productController.create);

// 🟢 Get all products (Public)
router.get("/", productController.getAll);

// 🟢 Get single product by ID (Public)
router.get("/:id", productController.getOne);

// 🔒 Add image(s) to a product by ID (Admin only)
router.post("/:id/add-image", protect, adminOnly, upload.array("images"), productController.addImage);

// 🔒 Delete a specific image from a product by ID (Admin only)
router.delete("/:id/delete-image", protect, adminOnly, productController.deleteImage);

// 🔒 Update product details and images by ID (Admin only)
router.put("/:id", protect, adminOnly, productController.update);

// 🔒 Delete a product by ID (Admin only)
router.delete("/:id", protect, adminOnly, productController.remove);

module.exports = router;
