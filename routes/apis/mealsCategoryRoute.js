const express = require("express");
const {
  getMealsCategories,
  getMealsCategory,
  updateMealsCategory,
  deleteMealsCategory,
  createMealsCategory,
} = require("../../services/mealsCategoryService");

const router = express.Router();

const authServices = require("../../services/authServices");
const {
  getOneMealCategoryValidator,
  updateMealCategoryValidator,
  deleteMealCategoryValidator,
  createMealCategoryValidator,
} = require("../../utils/validators/mealCategoriesValidator");

router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowTo("admin"),
    createMealCategoryValidator,
    createMealsCategory
  )
  .get(authServices.protect, getMealsCategories);

router
  .route("/:id")
  .get(authServices.protect, getOneMealCategoryValidator, getMealsCategory)
  .put(
    authServices.protect,
    authServices.allowTo("admin"),
    updateMealCategoryValidator,
    updateMealsCategory
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin"),
    deleteMealCategoryValidator,
    deleteMealsCategory
  );

module.exports = router;
