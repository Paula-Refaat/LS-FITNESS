const fs = require("fs/promises");
const path = require("path");
const MealsModel = require("../models/mealsModel");
const factory = require("./handllerFactory");
const { uploadSingleMedia } = require("../middlewares/uploadImageMiddleware");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

exports.uploadMealImage = uploadSingleMedia("image", "image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const directoryPath = "uploads/meals";

    await fs.mkdir(directoryPath, { recursive: true });

    const imageName = `meals-${uuidv4()}-${Date.now()}.webp`;
    const imagePath = path.join(directoryPath, imageName);

    await fs.writeFile(imagePath, req.file.buffer);

    const nameOfImg = imageName.split(".")[0];

    req.body.image = nameOfImg;
  }

  next();
});

exports.createMeal = factory.createOne(MealsModel);

exports.getAllMeals = factory.getAll(MealsModel, "Meals");

exports.getSpecificMeal = factory.getOne(MealsModel);

exports.updateMeal = factory.updateOne(MealsModel);

exports.deleteMeal = factory.deleteOne(MealsModel);
