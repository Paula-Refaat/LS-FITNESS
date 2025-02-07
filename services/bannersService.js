const fs = require("fs/promises");
const path = require("path");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleMedia } = require("../middlewares/uploadImageMiddleware");
const BannersModel = require("../models/bannersModel");
const factory = require("./handllerFactory");

exports.uploadBannerImage = uploadSingleMedia("image", "image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const directoryPath = "uploads/banners";

    await fs.mkdir(directoryPath, { recursive: true });

    const imageName = `banners-${uuidv4()}-${Date.now()}.webp`;
    const imagePath = path.join(directoryPath, imageName);

    await fs.writeFile(imagePath, req.file.buffer);

    const nameOfImg = imageName.split(".")[0];

    req.body.image = nameOfImg;
  }

  next();
});

exports.filterBannersBasedOnGender = (req, res, next) => {
  // if not authorized user [guest], then skip filteration
  if (!req?.user || !req.user?.role) {
    return next();
  }

  if (!req.filterObj) {
    req.filterObj = {};
  }

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

exports.createBanner = factory.createOne(BannersModel);

exports.getAllBanners = factory.getAll(BannersModel, "Banners");

exports.getSpecificBanner = factory.getOne(BannersModel);

exports.updateBanner = factory.updateOne(BannersModel);

exports.deleteBanner = factory.deleteOne(BannersModel);
