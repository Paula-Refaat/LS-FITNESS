// const mongoose = require("mongoose");
// const asyncHandler = require("express-async-handler");
// const ApiError = require("../utils/apiError");
const DeepAnatomy = require("../models/deepAnatomyModel");
const factory = require("./handllerFactory");

// Filter out Category that are not in the trash
exports.filterOnDeepAnatomyNotInTrash = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }

  // شمل المستندات التي لا تحتوي على isDeleted أو التي isDeleted ليست true
  req.filterObj.$or = [
    { isDeleted: { $exists: false } }, // المستندات التي لا تحتوي على isDeleted
    { isDeleted: false }, // المستندات التي isDeleted = false
  ];

  next();
};
// Filter out Category that are in the trash
exports.filterOnDeepAnatomyInTrash = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }

  req.filterObj.isDeleted = true;

  next();
};

//@desc get list of DeepAnatomy
//@route GET /api/v1/deepAnatomy
//@access public
exports.getDeepAnatomies = factory.getAll(DeepAnatomy, "DeepAnatomy");

//@desc get specific DeepAnatomy by id
//@route GET /api/v1/deepAnatomy/:id
//@access public
exports.getDeepAnatomy = factory.getOne(DeepAnatomy);

//@desc create DeepAnatomy
//@route POST /api/v1/deepAnatomy
//@access private
exports.createDeepAnatomy = factory.createOne(DeepAnatomy);

//@desc update specific DeepAnatomy
//@route PUT /api/v1/deepAnatomy/:id
//@access private
exports.updateDeepAnatomy = factory.updateOne(DeepAnatomy);

exports.moveDeepAnatomyToRecycleBin = factory.moveToRecycleBin(DeepAnatomy);
exports.restoreDeepAnatomyFromRecycleBin =
  factory.restoreFromRecycleBin(DeepAnatomy);

//@desc delete deepAnatomy
//@route DELETE /api/v1/deepAnatomy/:id
//@access private
exports.deleteDeepAnatomy = factory.deleteOne(DeepAnatomy);
