const mongoose = require("mongoose");
const { TABLES } = require("../constants");

const testSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(TABLES.TEST, testSchema);
