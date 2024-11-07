const factory = require("./handllerFactory");
const MealsCategory = require("../models/mealsCategoryModel");

//@desc get all meals categories
//@route GET /api/v1/mealsCategory
//@access protected
exports.getMealsCategories = factory.getAll(MealsCategory, "MealsCategory");

//get specific meals category by id
//@route GET /api/v1/mealsCategory/:id
//@access protected
exports.getMealsCategory = factory.getOne(MealsCategory);
