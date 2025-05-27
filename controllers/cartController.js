const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.addToCart = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [{ product: productId, quantity }] });
  } else {
    const index = cart.items.findIndex(item => item.product.toString() === productId);
    if (index >= 0) {
      cart.items[index].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
  }

  res.json(cart);
};

exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  res.json(cart);
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(item => item.product.toString() !== productId);
  await cart.save();
  res.json(cart);
};
