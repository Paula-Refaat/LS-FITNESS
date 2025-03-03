const express = require("express");
const {
  getAllMeals,
  uploadMealImage,
  resizeImage,
  createMeal,
  getSpecificMeal,
  updateMeal,
  deleteMeal,
  calculateAllMealIngredients,
  mergeCalculationInGetAll,
  mergeCalculationInGetById,
} = require("../../services/mealsService");
const {
  createMealsValidator,
  updateMealsValidator,
  deleteMealsValidator,
  getOneMealsValidator,
  calculateAllMealIngredientsValidator,
} = require("../../utils/validators/mealsValidator");
const checkPermission = require("../../middlewares/permissionMiddleware");

const router = express.Router();
const authServices = require("../../services/authServices");

router
  .route("/")
  .get(mergeCalculationInGetAll, getAllMeals)
  .post(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Meals", "create"),
    uploadMealImage,
    resizeImage,
    createMealsValidator,
    createMeal
  );

router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin", "sub-admin"),
    checkPermission("Meals", "read"),
    mergeCalculationInGetById,
    getOneMealsValidator,
    getSpecificMeal
  )
  .put(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Meals", "update"),
    uploadMealImage,
    resizeImage,
    updateMealsValidator,
    updateMeal
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Meals", "delete"),
    deleteMealsValidator,
    deleteMeal
  );

router.post(
  "/:id/calculate",
  authServices.protect,
  authServices.allowTo("user", "admin", "sub-admin"),
  checkPermission("Meals", "create"),
  calculateAllMealIngredientsValidator,
  calculateAllMealIngredients
);

module.exports = router;
