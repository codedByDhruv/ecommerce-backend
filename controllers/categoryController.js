const Category = require("../models/Category");

exports.create = async (req, res) => {
  const { name } = req.body;
  const existing = await Category.findOne({ name });
  if (existing) return res.status(400).json({ message: "Category already exists" });

  const category = await Category.create({ name });
  res.status(201).json(category);
};

exports.getAll = async (req, res) => {
  try {
    // Parse page and limit from query params, set defaults if missing or invalid
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 5;
    const skip = (page - 1) * limit;

    // Fetch total count for pagination metadata
    const total = await Category.countDocuments();

    // Fetch paginated categories
    const categories = await Category.find()
      .skip(skip)
      .limit(limit);

    res.json({
      data: categories,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getFilteredCategories = async (req, res) => {
  try {
    const { category } = req.query;

    // If category is provided, use regex for partial and case-insensitive match
    const filter = category
      ? { name: { $regex: category, $options: "i" } }
      : {};

    const categories = await Category.find(filter);

    res.json({
      data: categories,
      totalItems: categories.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
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
