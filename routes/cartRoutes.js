const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  addToCart,
  getCart,
  removeFromCart,
  updateCart,
} = require("../controllers/cartController");

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/remove", protect, removeFromCart);
router.patch("/update", protect, updateCart);

module.exports = router;
