const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.placeOrder = async (req, res) => {
  const userId = req.user._id;
  const { shippingAddress } = req.body;

  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const products = cart.items.map(item => ({
    product: item.product._id,
    quantity: item.quantity
  }));

  const totalAmount = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const order = await Order.create({
    user: userId,
    products,
    shippingAddress,
    totalAmount,
  });

  // Reduce stock quantity
  for (const item of cart.items) {
    item.product.qty -= item.quantity;
    await item.product.save();
  }

  // Clear cart
  await Cart.findOneAndDelete({ user: userId });

  res.status(201).json({ message: "Order placed successfully", order });
};

exports.getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments({ user: req.user._id });

    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 }) // optional: latest first
      .skip(skip)
      .limit(limit)
      .populate("products.product");

    res.json({
      orders,
      totalOrders,
      page,
      limit,
      totalPages: Math.ceil(totalOrders / limit),
    });
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments();

    const orders = await Order.find()
      .sort({ createdAt: -1 }) // Optional: sort newest first
      .skip(skip)
      .limit(limit)
      .populate("user")
      .populate("products.product");

    res.json({
      orders,
      totalOrders,
      page,
      limit,
      totalPages: Math.ceil(totalOrders / limit),
    });
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const userId = req.user._id;
  const userRole = req.user.role; // 'admin' or 'user'
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // User restrictions
    if (userRole !== "admin") {
      if (!order.user.equals(userId)) {
        return res.status(403).json({ message: "You can only update your own orders." });
      }

      // Users can only cancel before it's shipped
      if (status === "Cancelled") {
        if (["Shipped", "Delivered"].includes(order.status)) {
          return res.status(400).json({ message: "Cannot cancel after shipment." });
        }
      } else if (status === "Returned") {
        if (order.status !== "Delivered") {
          return res.status(400).json({ message: "You can only return delivered orders." });
        }
      } else {
        return res.status(403).json({ message: "You are not allowed to set this status." });
      }
    }

    // Admin can update to any valid status
    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: "Server error" });
  }
};
