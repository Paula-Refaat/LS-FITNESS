const express = require("express");
const {
  getAllMeals,
  uploadMealImage,
  resizeImage,
  createMeal,
  getSpecificMeal,
  updateMeal,
  deleteMeal,
} = require("../../services/mealsService");
const {
  createMealsValidator,
  updateMealsValidator,
  deleteMealsValidator,
  getOneMealsValidator,
} = require("../../utils/validators/mealsValidator");
const checkPermission = require("../../middlewares/permissionMiddleware");

const router = express.Router();
const authServices = require("../../services/authServices");

router
  .route("/")
  .get(getAllMeals)
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

module.exports = router;
