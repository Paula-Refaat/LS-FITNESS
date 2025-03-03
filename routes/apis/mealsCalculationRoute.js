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
const checkPermission = require("../../middlewares/permissionMiddleware");

const router = express.Router();
const authServices = require("../../services/authServices");
const {
  createMealCategoryValidator,
} = require("../../utils/validators/mealCategoriesValidator");

router
  .route("/")
  .get(
    // authServices.protect,
    // authServices.allowTo("user", "admin", "sub-admin"),
    // checkPermission("MealsCalculation", "read"),
    filterOnMealsCalculationNotInTrash,
    getMealsCalculation
  )
  .post(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("MealsCalculation", "create"),
    uploadMealCalculationImage,
    resizeImage,
    createMealsCalculationValidator,
    createMealsCalculation
  );
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin", "sub-admin"),
    checkPermission("MealsCalculation", "read"),
    getSpecificMealCalculation
  )
  .put(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("MealsCalculation", "update"),
    uploadMealCalculationImage,
    resizeImage,
    updateMealsCalculationValidator,
    updateMealsCalculation
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("MealsCalculation", "delete"),
    deleteMealsCalculationValidator,
    deleteMealsCalculation
  );
router.post(
  "/calc",
  authServices.protect,
  checkPermission("MealsCalculation", "create"),
  uploadMealCalculationImage,
  makeCalculationValidator,
  calculateMeal
);

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("MealsCalculation", "delete"),
  moveMealsCalculationToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("MealsCalculation", "delete"),
  restoreMealsCalculationFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("MealsCalculation", "delete"),
  filterOnMealsCalculationInTrash,
  getMealsCalculation
);

module.exports = router;
