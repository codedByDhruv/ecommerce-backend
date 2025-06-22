const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

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
  try {
    // Get page and limit from query params, with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // Get total count of products for pagination metadata
    const totalItems = await Product.countDocuments();

    // Fetch products with pagination and populate category
    const products = await Product.find()
      .populate("category")
      .skip(skip)
      .limit(limit);

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit);

    // Send paginated response with metadata
    res.json({
      data: products,
      page,
      limit,
      totalPages,
      totalItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getOne = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  res.json(product);
};

exports.addImage = async (req, res) => {
  const { id } = req.params;
  const images = req.files?.map(file => file.path);

  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  product.images.push(...images);
  await product.save();

  res.json({ message: "Images added", product });
};

exports.addImage = async (req, res) => {
  const { id } = req.params;
  const images = req.files?.map(file => file.path);

  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  product.images.push(...images);
  await product.save();

  res.json({ message: "Images added", product });
};

exports.deleteImage = async (req, res) => {
  const { id } = req.params;
  const { imageUrl } = req.body; 

  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  product.images = product.images.filter(img => img !== imageUrl);
  await product.save();

  // Optionally delete file from filesystem
  const imagePath = path.join(__dirname, "../", imageUrl); // Update path logic if needed
  fs.unlink(imagePath, err => {
    if (err) console.warn("Failed to delete image from disk:", err);
  });

  res.json({ message: "Image deleted", product });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, category, sku, description, price, qty } = req.body;

  const updateData = { name, category, sku, description, price, qty };

  const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
  res.json(product);
};

exports.remove = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.images.forEach(imagePath => {
      const fullPath = path.join(__dirname, "..", imagePath);
      fs.unlink(fullPath, err => {
        if (err) console.error("Failed to delete image:", fullPath, err.message);
      });
    });

    await product.deleteOne(); 
    res.json({ message: "Product and images deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};