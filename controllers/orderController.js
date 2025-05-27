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
  const orders = await Order.find({ user: req.user._id }).populate("products.product");
  res.json(orders);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user").populate("products.product");
  res.json(orders);
};
