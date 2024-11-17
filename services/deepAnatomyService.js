// const mongoose = require("mongoose");
// const asyncHandler = require("express-async-handler");
// const ApiError = require("../utils/apiError");
const DeepAnatomy = require("../models/deepAnatomyModel");
const factory = require("./handllerFactory");

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
