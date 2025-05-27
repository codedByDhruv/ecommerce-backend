// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.post("/", protect, adminOnly, upload.array("images"), productController.create);
router.get("/", productController.getAll);
router.get("/:id", productController.getOne);
router.put("/:id", protect, adminOnly, upload.array("images"), productController.update);
router.delete("/:id", protect, adminOnly, productController.remove);

module.exports = router;
