// const mongoose = require("mongoose");
// const asyncHandler = require("express-async-handler");
// const ApiError = require("../utils/apiError");
const BodyPart = require("../models/bodyPartModel");
const factory = require("./handllerFactory");

//@desc get list of bodyParts
//@route GET /api/v1/bodyParts
//@access public
exports.getBodyParts = factory.getAll(BodyPart, "BodyPart");

//@desc get specific bodyParts by id
//@route GET /api/v1/bodyParts/:id
//@access public
exports.getBodyPart = factory.getOne(BodyPart);

//@desc create bodyPart
//@route POST /api/v1/bodyParts
//@access private
exports.createBodyPart = factory.createOne(BodyPart);

//@desc update specific bodyPart
//@route PUT /api/v1/bodyParts/:id
//@access private
exports.updateBodyPart = factory.updateOne(BodyPart);

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
