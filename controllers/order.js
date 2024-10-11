const CatchAsync = require("../utils/catchAsync");
const ErrorHandler = require("../utils/ErrorHandler");
const Factory = require("./Factory");
const Order = require("../model/order");

exports.getAll = Factory.getAll(Order);

exports.updateSelectedWeek = CatchAsync(async (req, res, next) => {
  const { selectedCards, week } = req.body;

  const updateField = {};
  updateField[`isWeek${week}`] = true;

  // Update all selected cards with the specified week
  await Order.updateMany(
    { _id: { $in: selectedCards } },
    { $set: updateField }
  );

  res
    .status(200)
    .json({ status: "success", message: "Week updated successfully" });
});

exports.deleteSelectedWeek = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { week } = req.body;

  const updateField = {};
  updateField[`isWeek${week}`] = false;

  const order = await Order.findByIdAndUpdate(
    id,
    { $set: updateField },
    { new: true, runValidators: true }
  );

  if (!order) {
    return res.status(404).json({ status: "fail", message: "Order not found" });
  }

  res.status(200).json({
    status: "success",
    message: `Recipes from Week${week} deleted successfully`,
    data: order,
  });
});
