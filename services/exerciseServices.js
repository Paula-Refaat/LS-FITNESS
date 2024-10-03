// const mongoose = require("mongoose");
// const asyncHandler = require("express-async-handler");
// const ApiError = require("../utils/apiError");
const Exercise = require("../models/exerciseModel");
const factory = require("./handllerFactory");

//@desc get list of Exercises
//@route GET /api/v1/exercises
//@access public
exports.getExercises = factory.getAll(Exercise, "Exercise");

//@desc get specific exercise by id
//@route GET /api/v1/exercises/:id
//@access public
exports.getExercise = factory.getOne(Exercise);

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
