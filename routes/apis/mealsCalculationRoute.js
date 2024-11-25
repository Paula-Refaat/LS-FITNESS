const express = require("express");
const {
  getMealsCalculation,
  calculateMeal,
  getSpecificMealCalculation,
  updateMealsCalculation,
  createMealsCalculation,
  uploadMealCalculationImage,
  resizeImage,
  deleteMealsCalculation,
} = require("../../services/mealsCalculationServices");
const {
  makeCalculationValidator,
  updateMealsCalculationValidator,
  deleteMealsCalculationValidator,
} = require("../../utils/validators/mealsCalculationValidator");

const router = express.Router();
const authServices = require("../../services/authServices");
const {
  createMealCategoryValidator,
} = require("../../utils/validators/mealCategoriesValidator");

router
  .route("/")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin"),
    getMealsCalculation
  )
  .post(
    authServices.protect,
    authServices.allowTo("user", "admin"),
    uploadMealCalculationImage,
    resizeImage,
    createMealCategoryValidator,
    createMealsCalculation
  );
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin"),
    getSpecificMealCalculation
  )
  .put(
    authServices.protect,
    authServices.allowTo("admin"),
    uploadMealCalculationImage,
    resizeImage,
    updateMealsCalculationValidator,
    updateMealsCalculation
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin"),
    deleteMealsCalculationValidator,
    deleteMealsCalculation
  );
router.post(
  "/calc",
  authServices.protect,
  authServices.allowTo("user", "admin"),
  uploadMealCalculationImage,
  makeCalculationValidator,
  calculateMeal
);

module.exports = router;
