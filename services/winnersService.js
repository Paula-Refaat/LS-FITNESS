const fs = require("fs/promises");
const path = require("path");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleMedia } = require("../middlewares/uploadImageMiddleware");
const WinnersModel = require("../models/winnersModel");
const factory = require("./handllerFactory");

exports.uploadWinnerImage = uploadSingleMedia("image", "image");

exports.resizeWinnerImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const directoryPath = "uploads/winners";

    await fs.mkdir(directoryPath, { recursive: true });

    const imageName = `winners-${uuidv4()}-${Date.now()}.webp`;
    const imagePath = path.join(directoryPath, imageName);

    await fs.writeFile(imagePath, req.file.buffer);

    const nameOfImg = imageName.split(".")[0];

    req.body.image = nameOfImg;
  }

  next();
});

exports.createWinner = factory.createOne(WinnersModel);

exports.getAllWinners = factory.getAll(WinnersModel, "Winners");

exports.getSpecificWinner = factory.getOne(WinnersModel);

exports.updateWinner = factory.updateOne(WinnersModel);

exports.deleteWinner = factory.deleteOne(WinnersModel);
