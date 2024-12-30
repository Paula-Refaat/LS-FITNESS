const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const factory = require("./handllerFactory");
const Permission = require("../models/permissionModel");

exports.createPermission = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { create, read, fullAccess } = req.body;
  try {
    const updatedPermission = await Permission.findOneAndUpdate(
      { userId },
      { create, read, fullAccess },
      { upsert: true, new: true }
    );

    res.json({
      message: "Permissions updated successfully",
      updatedPermission,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating permissions", error });
  }
});
