const CatchAsync = require("../utils/catchAsync");
const ErrorHandler = require("../utils/ErrorHandler");
const Factory = require("./Factory");
const Test = require("../model/test");

exports.create = Factory.createOne(Test);
exports.getAll = Factory.getAll(Test);
exports.getOne = Factory.getOne(Test);
exports.update = Factory.updateOne(Test);
exports.delete = Factory.softDelete(Test);
