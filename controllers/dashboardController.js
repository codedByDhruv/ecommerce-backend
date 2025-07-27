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


exports.getOrderChartData = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const monthlyOrders = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Format result to ensure all months are present
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      orders: 0,
      revenue: 0,
    }));

    monthlyOrders.forEach((item) => {
      const index = item._id - 1;
      months[index].orders = item.totalOrders;
      months[index].revenue = item.totalAmount;
    });

    res.json({ success: true, data: months });
  } catch (err) {
    console.error("Order chart data error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};