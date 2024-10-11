const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    name: { type: String, required: true },
    instructions: [{ type: String }],
    cuisine: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5 },
    mealType: [{ type: String }],
    isWeek1: Boolean,
    isWeek2: Boolean,
    isWeek3: Boolean,
    isWeek4: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
