const fs = require("fs/promises");
const path = require("path");
const factory = require("./handllerFactory");
const { uploadSingleMedia } = require("../middlewares/uploadImageMiddleware");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const SocialMediaLinks = require("../models/socialMediaLinksModel");

exports.uploadSocialMediaImage = uploadSingleMedia("image", "image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const directoryPath = "uploads/socialMediaLinks";

    await fs.mkdir(directoryPath, { recursive: true });

    const imageName = `socialMediaLinks-${uuidv4()}-${Date.now()}.webp`;
    const imagePath = path.join(directoryPath, imageName);

    await fs.writeFile(imagePath, req.file.buffer);

    const nameOfImg = imageName.split(".")[0];

    req.body.image = nameOfImg;
  }

  next();
});

// create new SocialMediaLinks
exports.createSocialMediaLinks = factory.createOne(SocialMediaLinks);

// get all SocialMediaLinks
exports.getSocialMediaLinks = factory.getAll(
  SocialMediaLinks,
  "SocialMediaLinks"
);

// get single SocialMediaLinks
exports.getSingleSocialMediaLink = factory.getOne(SocialMediaLinks);

// update single SocialMediaLinks
exports.updateSocialMediaLink = factory.updateOne(SocialMediaLinks);

// delete single SocialMediaLink
exports.deleteSocialMediaLinks = factory.deleteOne(SocialMediaLinks);
