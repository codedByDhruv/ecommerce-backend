// controllers/dashboardController.js
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const User = require("../models/User");

exports.getSummary = async (req, res) => {
  try {
    const [productCount, categoryCount, orderCount, userCount] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Order.countDocuments(),
      User.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        totalProducts: productCount,
        totalCategories: categoryCount,
        totalOrders: orderCount,
        totalUsers: userCount
      }
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
