const APIFeatures = require("../utils/APIFeatures");
const catchAsync = require("../utils/catchAsync");
const ErrorHandler = require("../utils/ErrorHandler");

exports.softDelete = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doc) {
      return next(new ErrorHandler("No document found with that ID", 404));
    }

    return res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new ErrorHandler("No document found with that ID", 404));
    }

    return res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new ErrorHandler("No document found with that ID", 404));
    }

    return res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.updateOneWithSave = (Model) =>
  catchAsync(async (req, res, next) => {
    // Use findById instead of findByIdAndUpdate to get the document
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      return next(new ErrorHandler("No document found with that ID", 404));
    }

    // Update the document with the request body
    Object.assign(doc, req.body);

    // Save the document to trigger the pre-save middleware
    await doc.save();

    return res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    return res.status(201).json({
      status: "success",
      data: doc,
    });
  });

exports.getOne = (Model, ...populations) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    populations.forEach((populate, index) => {
      if (index % 2 === 0) {
        const populateRef = populate;
        const populateFields = populations[index + 1];
        query = query.populate(populateRef, populateFields);
      }
    });
    const doc = await query;

    if (!doc) {
      return next(new ErrorHandler("No document found with that ID", 404));
    }

    return res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.getAll = (Model, filter = {}, search = [], ...populations) =>
  catchAsync(async (req, res, next) => {
    const finalFilter = { ...filter, isDeleted: { $ne: true } }; // Exclude soft-deleted documents
    let query = Model.find(finalFilter);

    populations.forEach((populate, index) => {
      if (index % 2 === 0) {
        const populateRef = populate;
        const populateFields = populations[index + 1];
        query = query.populate(populateRef, populateFields);
      }
    });

    const features = new APIFeatures(query, req.query, search)
      .filter()
      .sort()
      .limitFields();
    // .paginate();

    const doc = await features.query;
    const total = await Model.countDocuments({ ...finalFilter });

    return res.status(200).json({
      status: "success",
      results: doc.length,
      total,
      data: doc,
    });
  });
