const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { placeOrder, getMyOrders, getAllOrders, updateOrderStatus } = require("../controllers/orderController");

router.post("/place", protect, placeOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/all", protect, adminOnly, getAllOrders);
router.put("/:orderId/status", protect, updateOrderStatus);

module.exports = router;
