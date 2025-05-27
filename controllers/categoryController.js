const Category = require("../models/Category");

exports.create = async (req, res) => {
  const { name } = req.body;
  const existing = await Category.findOne({ name });
  if (existing) return res.status(400).json({ message: "Category already exists" });

  const category = await Category.create({ name });
  res.status(201).json(category);
};

exports.getAll = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(id, { name }, { new: true });
  res.json(category);
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await Category.findByIdAndDelete(id);
  res.json({ message: "Category deleted" });
};
