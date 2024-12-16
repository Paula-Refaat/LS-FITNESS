// const mongoose = require("mongoose");
// const asyncHandler = require("express-async-handler");
const BodyPart = require("../models/bodyPartModel");
const factory = require("./handllerFactory");
const asyncHandler = require("express-async-handler");
const Exercise = require("../models/exerciseModel");
const ApiError = require("../utils/ApiError");

// Filter out BodyParts that are not in the trash
exports.filterOnBodyPartsNotInTrash = (req, res, next) => {
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
// Filter out BodyParts that are in the trash
exports.filterOnBodyPartsInTrash = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }

  req.filterObj.isDeleted = true;

  next();
};

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

exports.moveBodyPartToRecycleBin = factory.moveToRecycleBin(BodyPart);
exports.restoreBodyPartFromRecycleBin = factory.restoreFromRecycleBin(BodyPart);

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
