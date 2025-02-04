const Exercise = require("../models/exerciseModel");
const factory = require("./handllerFactory");
const { getThumbnailsFromUrl } = require("../utils/getThumbnailsFromUrl");

// Filter exercises based on user's gender
exports.filterExercisesBasedOnGender = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }
  // console.log(req.user.role)
  if (req.user.role === "admin" || req.user.role === "sub-admin") {
    return next();
  }
  if (req.user.goalsData.gender === "male") {
    req.filterObj.targetGender = "men";
  } else if (req.user.goalsData.gender === "female") {
    req.filterObj.targetGender = "women";
  }
  next();
};
// Filter out exercises that are not in the trash
exports.filterOnExercisesNotInTrash = (req, res, next) => {
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
// Filter out exercises that are in the trash
exports.filterOnExercisesInTrash = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }

  req.filterObj.isDeleted = true;

  next();
};
// Function to get thumbnails using the video ID from Vimeo URL
exports.handlingVideoResponse = async (req, res, next) => {
  try {
    // إذا كان الطلب تحديث ولم يتم إرسال vimeo_video_Url، تجاوز العملية
    if (
      (req.method === "PUT" || req.method === "PATCH") &&
      !req.body.vimeo_video_Url
    ) {
      // console.log()
      return next();
    }

    // استدعاء getThumbnailsFromUrl فقط إذا كان vimeo_video_Url موجودًا
    if (req.body.vimeo_video_Url) {
      const videoResponse = await getThumbnailsFromUrl(
        req.body.vimeo_video_Url
      );
      if (videoResponse.success === false) {
        return res.status(400).json({
          status: "error",
          message: "Invalid Vimeo video URL",
        });
      }

      req.body.video = videoResponse;
    }

    next();
  } catch (error) {
    console.error("Error in handlingVideoResponse:", error.message);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing the video response",
    });
  }
};

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

exports.moveToRecycleBin = factory.moveToRecycleBin(Exercise);
exports.restoreFromRecycleBin = factory.restoreFromRecycleBin(Exercise);

//@desc delete specific exercise
//@route DELETE /api/v1/exercises/:id
//@access private
exports.deleteExercise = factory.deleteOne(Exercise);
