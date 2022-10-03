const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 32,
      unique: true,
      required: [true, "Please add a category name"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
