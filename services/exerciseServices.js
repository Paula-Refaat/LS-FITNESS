const Exercise = require("../models/exerciseModel");
const factory = require("./handllerFactory");
const ApiError = require("../utils/ApiError");
const axios = require("axios");
// Filter exercises based on user's gender
exports.filterExercisesBasedOnGender = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }
  if (req.user.gender === "male") {
    req.filterObj.targetGender = "men";
  } else if (req.user.gender === "female") {
    req.filterObj.targetGender = "women";
  }
  next();
};

// Function to get video ID from Vimeo URL
function getVideoIdFromUrl(vimeoUrl) {
  const regex = /vimeo\.com\/(\d+)/;
  const match = vimeoUrl.match(regex);
  return match ? match[1] : null;
}

// Function to get thumbnails using the video ID from Vimeo URL
exports.getThumbnailsFromUrl = async (req, res, next) => {
  const videoId = getVideoIdFromUrl(req.body.vimeo_video_Url);

  if (!videoId) {
    console.error("Invalid Vimeo URL.");
    return next(new ApiError("Invalid Vimeo URL", 400));
  }

  try {
    const response = await axios.get(`${process.env.VIMEO_API}/${videoId}`, {
      headers: {
        Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
      },
    });

    const { pictures } = response.data;

    // Filter out default thumbnails (if needed) and print content-based thumbnails
    const thumbnails = pictures.sizes
      .map((size) => size.link)
      .filter((url) => !url.includes("default-"));

    req.body.video = {
      url: req.body.vimeo_video_Url,
      public_id: videoId,
      thumbnail: thumbnails.pop(),
    };

    // console.log("Thumbnails:", thumbnails.pop());
    // return thumbnails;
    next();
  } catch (error) {
    console.error("Error fetching video thumbnails:", error);
    return next(new ApiError("Error fetching video thumbnails", 500));
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

//@desc delete specific exercise
//@route DELETE /api/v1/exercises/:id
//@access private
exports.deleteExercise = factory.deleteOne(Exercise);
