const Product = require("../models/Product");

exports.create = async (req, res) => {
  try {
    const { name, category, sku, description, price, qty } = req.body;
    const images = req.files.map(file => file.path);

    const product = await Product.create({
      name, category, sku, description, price, qty, images
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  const products = await Product.find().populate("category");
  res.json(products);
};

exports.getOne = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  res.json(product);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, category, sku, description, price, qty } = req.body;
  const images = req.files?.map(file => file.path);

  const updateData = { name, category, sku, description, price, qty };
  if (images?.length) updateData.images = images;

  const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
  res.json(product);
};

exports.remove = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};
