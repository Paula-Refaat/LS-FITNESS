const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const { uploadSingleMedia } = require("../middlewares/uploadImageMiddleware");
const Supplement = require("../models/supplementModel");
const { getThumbnailsFromUrl } = require("../utils/getThumbnailsFromUrl");
const factory = require("./handllerFactory");

// Filter out Supplement that are not in the trash
exports.filterOnSupplementsNotInTrash = (req, res, next) => {
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

// Filter out Supplement that are in the trash
exports.filterOnSupplementsInTrash = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }

  req.filterObj.isDeleted = true;

  next();
};

//upload Single image
exports.uploadSupplementImage = uploadSingleMedia("image", "image");

//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const directoryPath = "uploads/supplements";
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    const imageName = `supplement-${uuidv4()}-${Date.now()}.webp`;
    const imagePath = `uploads/supplements/${imageName}`;

    fs.writeFileSync(imagePath, req.file.buffer);

    //Save image into our db
    req.body.image = imageName;
  }
  next();
});
//@desc get list of Supplements
//@route GET /api/v1/Supplements
//@access public
exports.getSupplements = factory.getAll(Supplement, "Supplement");

//@desc get specific Supplement by id
//@route GET /api/v1/Supplements/:id
//@access public
exports.getSupplement = factory.getOne(Supplement);

//@desc create Supplement
//@route POST /api/v1/Supplements
//@access private
exports.createSupplement = factory.createOne(Supplement);

//@desc update specific Supplement
//@route PUT /api/v1/Supplements/:id
//@access private
exports.updateSupplement = factory.updateOne(Supplement);

exports.moveSupplementToRecycleBin = factory.moveToRecycleBin(Supplement);
exports.restoreSupplementFromRecycleBin =
  factory.restoreFromRecycleBin(Supplement);

//@desc delete Supplement
//@route DELETE /api/v1/Supplements/:id
//@access private
exports.deleteSupplement = factory.deleteOne(Supplement);
