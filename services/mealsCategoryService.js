const factory = require("./handllerFactory");
const MealsCategory = require("../models/mealsCategoryModel");

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
