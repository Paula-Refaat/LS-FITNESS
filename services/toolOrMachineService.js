// const mongoose = require("mongoose");
// const asyncHandler = require("express-async-handler");
// const ApiError = require("../utils/apiError");
const ToolOrMachine = require("../models/toolOrMachineModel");
const factory = require("./handllerFactory");

// Filter out ToolOrMachine that are not in the trash
exports.filterOnToolOrMachineNotInTrash = (req, res, next) => {
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

// Filter out ToolOrMachine that are in the trash
exports.filterOnToolOrMachineInTrash = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }

  req.filterObj.isDeleted = true;

  next();
};

//@desc get list of ToolOrMachine
//@route GET /api/v1/ToolOrMachine
//@access public
exports.getToolOrMachines = factory.getAll(ToolOrMachine, "ToolOrMachine");

//@desc get specific ToolOrMachine by id
//@route GET /api/v1/ToolOrMachine/:id
//@access public
exports.getToolOrMachine = factory.getOne(ToolOrMachine);

//@desc create ToolOrMachine
//@route POST /api/v1/ToolOrMachine
//@access private
exports.createToolOrMachine = factory.createOne(ToolOrMachine);

//@desc update specific ToolOrMachine
//@route PUT /api/v1/ToolOrMachine/:id
//@access private
exports.updateToolOrMachine = factory.updateOne(ToolOrMachine);

exports.moveToolOrMachineToRecycleBin = factory.moveToRecycleBin(ToolOrMachine);
exports.restoreToolOrMachineFromRecycleBin =
  factory.restoreFromRecycleBin(ToolOrMachine);

exports.deleteToolOrMachine = factory.deleteOne(ToolOrMachine);
