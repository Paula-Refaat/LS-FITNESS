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
  filterOnMealsCalculationNotInTrash,
  moveMealsCalculationToRecycleBin,
  restoreMealsCalculationFromRecycleBin,
  filterOnMealsCalculationInTrash,
} = require("../../services/mealsCalculationServices");
const {
  makeCalculationValidator,
  updateMealsCalculationValidator,
  deleteMealsCalculationValidator,
  createMealsCalculationValidator,
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
    filterOnMealsCalculationNotInTrash,
    getMealsCalculation
  )
  .post(
    authServices.protect,
    authServices.allowTo("user", "admin"),
    uploadMealCalculationImage,
    resizeImage,
    createMealsCalculationValidator,
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

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("admin"),
  moveMealsCalculationToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("admin"),
  restoreMealsCalculationFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("admin"),
  filterOnMealsCalculationInTrash,
  getMealsCalculation
);

module.exports = router;
