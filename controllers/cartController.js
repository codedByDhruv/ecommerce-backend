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
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart) return res.json({ items: [], totalItems: 0 });

    const totalItems = cart.items.length;
    const paginatedItems = cart.items.slice(skip, skip + limit);

    res.json({
      items: paginatedItems,
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (err) {
    console.error("Failed to fetch cart:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateCart = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  if (!productId || typeof quantity !== 'number') {
    return res.status(400).json({ message: 'Product ID and quantity are required' });
  }

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const index = cart.items.findIndex(item => item.product.toString() === productId);

    if (index === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    cart.items[index].quantity = quantity;

    await cart.save();

    res.json({ message: 'Cart updated successfully', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(item => item.product.toString() !== productId);
  await cart.save();
  res.json(cart);
};
