// const mongoose = require("mongoose");
// const asyncHandler = require("express-async-handler");
// const ApiError = require("../utils/apiError");
const ToolOrMachine = require("../models/toolOrMachineModel");
const factory = require("./handllerFactory");

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

// TODO:
//@desc delete category
//@route DELETE /api/v1/categories/:id
//@access private
// exports.deleteCategory = asyncHandler(async (req, res, next) => {
//   await mongoose.connection
//     .transaction(async (session) => {
//       // Find and delete the category
//       const category = await Category.findByIdAndDelete(req.params.id).session(
//         session
//       );

//       // Check if category exists
//       if (!category) {
//         return next(
//           new ApiError(`Category not found for this id ${req.params.id}`, 404)
//         );
//       }

//       // Find associated courses
//       const service = await Service.find({ category: category._id }).session(
//         session
//       );

//       // Use Promise.all to parallelize deletion of related data
//       await Promise.all([
//         Service.deleteMany({
//           _id: { $in: service.map((serv) => serv._id) },
//         }).session(session),
//         Reviews.deleteMany({
//           service: { $in: service.map((serv) => serv._id) },
//         }).session(session),
//       ]);

//       // Return success response
//       res.status(204).send();
//     })
//     .catch((error) => {
//       // Handle any transaction-related errors
//       console.error("Transaction error:", error);
//       return next(new ApiError("Error during transaction", 500));
//     });
// });
