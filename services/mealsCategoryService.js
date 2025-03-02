const fs = require("fs/promises");
const path = require("path");
const factory = require("./handllerFactory");
const MealsCategory = require("../models/mealsCategoryModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const { uploadSingleMedia } = require("../middlewares/uploadImageMiddleware");
const { v4: uuidv4 } = require("uuid");

exports.uploadMealCategoryImage = uploadSingleMedia("image", "image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const directoryPath = "uploads/meals_categories";

    await fs.mkdir(directoryPath, { recursive: true });

    const imageName = `meals_categories-${uuidv4()}-${Date.now()}.webp`;
    const imagePath = path.join(directoryPath, imageName);

    await fs.writeFile(imagePath, req.file.buffer);

    const nameOfImg = imageName.split(".")[0];

    req.body.image = nameOfImg;
  }

  next();
});

// Filter out MealsCategory that are not in the trash
exports.filterOnMealsCategoryNotInTrash = (req, res, next) => {
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

// Filter out MealsCategory that are in the trash
exports.filterOnMealsCategoryInTrash = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }

  req.filterObj.isDeleted = true;

  next();
};

exports.canSetImageOnCreate = asyncHandler(async (req, res, next) => {
  if (req.body?.parentCategory && req.body?.image) {
    return next(new ApiError("Cannot add image for child categories", 400));
  }

  return next();
});

exports.canSetImageOnUpdate = asyncHandler(async (req, res, next) => {
  const category = await MealsCategory.findById(req.params.id);
  if (!category) return next(new ApiError("Category is not exist", 400));

  if (category?.parentCategory && req.body?.image) {
    return next(new ApiError("Cannot add image for child categories", 400));
  }

  return next();
});

//@desc create meals category
//@route POST /api/v1/mealsCategory
//access protected
exports.createMealsCategory = factory.createOne(MealsCategory);

//@desc get all meals categories
//@route GET /api/v1/mealsCategory
//@access protected
exports.getMealsCategories = factory.getAll(MealsCategory, "MealsCategory");

//get specific meals category by id
//@route GET /api/v1/mealsCategory/:id
//@access protected
exports.getMealsCategory = factory.getOne(MealsCategory);

//@desc update meals category
//@route PUT /api/v1/mealsCategory
//access protected
exports.updateMealsCategory = factory.updateOne(MealsCategory);

exports.moveMealsCategoryToRecycleBin = factory.moveToRecycleBin(MealsCategory);
exports.restoreMealsCategoryFromRecycleBin =
  factory.restoreFromRecycleBin(MealsCategory);

//@desc delete meals category
//@route DELETE /api/v1/mealsCategory
//access protected
exports.deleteMealsCategory = factory.deleteOne(MealsCategory);

exports.filterOnParentCategories = asyncHandler(async (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }

  if ("isParent" in req.query) {
    req.filterObj["parentCategory"] =
      req.query.isParent === "true"
        ? {
            $eq: null,
          }
        : {
            $ne: null,
          };

    delete req.query?.isParent;
  }

  return next();
});
