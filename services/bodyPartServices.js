// const mongoose = require("mongoose");
// const asyncHandler = require("express-async-handler");
const BodyPart = require("../models/bodyPartModel");
const factory = require("./handllerFactory");
const asyncHandler = require("express-async-handler");
const Exercise = require("../models/exerciseModel");
const ApiError = require("../utils/ApiError");

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
//@desc delete bodyPart
//@route DELETE /api/v1/bodyParts/:id
//@access private
exports.deleteBodyPart = factory.deleteOne(BodyPart);

exports.getDeepAnatomiesFromExerciseByBodyPart = asyncHandler(
  async (req, res, next) => {
    const { bodyPartId } = req.params;

    const exercises = await Exercise.find({
      bodyPart: bodyPartId,
    });
    if (!exercises || exercises.length === 0) {
      return next(
        new ApiError(`No exercises found for body part: ${bodyPartId}`, 404)
      );
    }
    let deepAnatomies = exercises.flatMap((exercise) => exercise.deepAnatomy);
    deepAnatomies = deepAnatomies.filter(
      (item, index, self) =>
        self.findIndex(
          (anatomy) => anatomy._id.toString() === item._id.toString()
        ) === index
    );
    res.status(200).json({ data: deepAnatomies });
  }
);
