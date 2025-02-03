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
const {
  handlingVideoResponse,
} = require("../../middlewares/handle-video-response");

router
  .route("/")
  .get(getAllMeals)
  .post(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Meals", "create"),
    uploadMealImage,
    resizeImage,
    handlingVideoResponse,
    createMealsValidator,
    createMeal
  );

router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin", "sub-admin"),
    checkPermission("MealsCalculation", "read"),
    getOneMealsValidator,
    getSpecificMeal
  )
  .put(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("MealsCalculation", "update"),
    uploadMealImage,
    resizeImage,
    handlingVideoResponse,
    updateMealsValidator,
    updateMeal
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("MealsCalculation", "delete"),
    deleteMealsValidator,
    deleteMeal
  );

router.post(
  "/:id/calculate",
  authServices.protect,
  authServices.allowTo("user", "admin", "sub-admin"),
  checkPermission("MealsCalculation", "create"),
  calculateAllMealIngredientsValidator,
  calculateAllMealIngredients
);

module.exports = router;
