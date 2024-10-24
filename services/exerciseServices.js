// const mongoose = require("mongoose");
// const asyncHandler = require("express-async-handler");
// const ApiError = require("../utils/apiError");
const Exercise = require("../models/exerciseModel");
const ApiError = require("../utils/ApiError");
const factory = require("./handllerFactory");
const asyncHandler = require("express-async-handler");

//@desc get list of Exercises
//@route GET /api/v1/exercises
//@access public
exports.getExercises = factory.getAll(Exercise, "Exercise");

//@desc get specific exercise by id
//@route GET /api/v1/exercises/:id
//@access public
exports.getExercise = asyncHandler(async (req, res, next) => {
  const exercise = await Exercise.findById(req.params.id);
  if (!exercise) {
    return next(new ApiError("Exercise not found", 404));
  }
  const data = {
    _id: exercise._id,
    title: exercise.title,
    targetGender: exercise.targetGender,
    category: exercise.category,
    bodyPart: exercise.bodyPart,
    url: exercise.videoUrl, // Directly use videoUrl
    public_id: exercise.videoUrl.split("/").pop(), // Extract public ID from video URL
    // createdAt: exercise.createdAt,
    // updatedAt: exercise.updatedAt,
  };
  res.status(200).json({ data: data });
});

//@desc create exercise
//@route POST /api/v1/exercises
//@access private
exports.createExercise = factory.createOne(Exercise);

//@desc update specific exercise
//@route PUT /api/v1/exercises/:id
//@access private
exports.updateExercise = factory.updateOne(Exercise);

//@desc delete specific exercise
//@route DELETE /api/v1/exercises/:id
//@access private
exports.deleteExercise = factory.deleteOne(Exercise);
