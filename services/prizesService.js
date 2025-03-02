const fs = require("fs/promises");
const path = require("path");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleMedia } = require("../middlewares/uploadImageMiddleware");
const PrizesModel = require("../models/prizesModel");
const factory = require("./handllerFactory");
const ApiError = require("../utils/ApiError");

exports.uploadPrizeImage = uploadSingleMedia("image", "image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const directoryPath = "uploads/prizes";

    await fs.mkdir(directoryPath, { recursive: true });

    const imageName = `prizes-${uuidv4()}-${Date.now()}.webp`;
    const imagePath = path.join(directoryPath, imageName);

    await fs.writeFile(imagePath, req.file.buffer);

    const nameOfImg = imageName.split(".")[0];

    req.body.image = nameOfImg;
  }

  next();
});

exports.checkIsCoverOnCreate = asyncHandler(async (req, res, next) => {
  if (req.body?.isCover === "true") {
    const isCoverAlreadyExists = await PrizesModel.findOne({
      isCover: true,
    });
    if (isCoverAlreadyExists)
      return next(new ApiError("Cannot add more than cover prize", 400));
  }

  return next();
});

exports.checkIsCoverOnUpdate = asyncHandler(async (req, res, next) => {
  const prizeBeforeEdit = await PrizesModel.findById(req.params.id);
  if (!prizeBeforeEdit) return next(new ApiError("Prize is not exist", 400));

  if (req.body?.isCover === "true" && !prizeBeforeEdit?.isCover) {
    const isCoverAlreadyExists = await PrizesModel.findOne({
      isCover: true,
    });
    if (isCoverAlreadyExists)
      return next(new ApiError("Cannot add more than cover prize", 400));
  }

  return next();
});

exports.createPrize = factory.createOne(PrizesModel);

exports.getAllPrizes = factory.getAll(PrizesModel, "Prizes");

exports.getSpecificPrize = factory.getOne(PrizesModel);

exports.updatePrize = factory.updateOne(PrizesModel);

exports.deletePrize = factory.deleteOne(PrizesModel);
