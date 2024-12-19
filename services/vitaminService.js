const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const { uploadSingleMedia } = require("../middlewares/uploadImageMiddleware");
const Vitamin = require("../models/vitaminModel");
const { getThumbnailsFromUrl } = require("../utils/getThumbnailsFromUrl");
const factory = require("./handllerFactory");

// Filter out Vitamin that are not in the trash
exports.filterOnVitaminsNotInTrash = (req, res, next) => {
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

// Filter out Vitamin that are in the trash
exports.filterOnVitaminsInTrash = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }

  req.filterObj.isDeleted = true;

  next();
};

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

//upload Single image
exports.uploadVitaminImage = uploadSingleMedia("image", "image");

//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const directoryPath = "uploads/vitamins";
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    const imageName = `Vitamin-${uuidv4()}-${Date.now()}.jpeg`;
    const imagePath = `uploads/vitamins/${imageName}`;

    fs.writeFileSync(imagePath, req.file.buffer);

    //Save image into our db
    req.body.image = imageName;
  }
  next();
});
//@desc get list of Vitamins
//@route GET /api/v1/Vitamins
//@access public
exports.getVitamins = factory.getAll(Vitamin, "Vitamin");

//@desc get specific Vitamin by id
//@route GET /api/v1/Vitamins/:id
//@access public
exports.getVitamin = factory.getOne(Vitamin);

//@desc create Vitamin
//@route POST /api/v1/Vitamins
//@access private
exports.createVitamin = factory.createOne(Vitamin);

//@desc update specific Vitamin
//@route PUT /api/v1/Vitamins/:id
//@access private
exports.updateVitamin = factory.updateOne(Vitamin);

exports.moveVitaminToRecycleBin = factory.moveToRecycleBin(Vitamin);
exports.restoreVitaminFromRecycleBin = factory.restoreFromRecycleBin(Vitamin);

//@desc delete Vitamin
//@route DELETE /api/v1/Vitamins/:id
//@access private
exports.deleteVitamin = factory.deleteOne(Vitamin);
