// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  category:    { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  images:      [String],
  sku:         { type: String, required: true, unique: true },
  description: String,
  price:       { type: Number, required: true },
  qty:         { type: Number, required: true },
});

module.exports = mongoose.model("Product", productSchema);
