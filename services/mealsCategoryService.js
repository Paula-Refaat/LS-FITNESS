const factory = require("./handllerFactory");
const MealsCategory = require("../models/mealsCategoryModel");

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

//@desc delete meals category
//@route DELETE /api/v1/mealsCategory
//access protected
exports.deleteMealsCategory = factory.deleteOne(MealsCategory);
