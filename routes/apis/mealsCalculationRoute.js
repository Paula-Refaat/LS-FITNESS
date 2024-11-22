const express = require("express");
const {
  getMealsCalculation,
  calculateMeal,
  getSpecificMealCalculation,
} = require("../../services/mealsCalculationServices");
const {
  makeCalculationValidator,
} = require("../../utils/validators/mealsCalculationValidator");

const router = express.Router();
const authServices = require("../../services/authServices");

router.get(
  "/",
  authServices.protect,
  authServices.allowTo("user", "admin"),
  getMealsCalculation
);
router.get(
  "/:id",
  authServices.protect,
  authServices.allowTo("user", "admin"),
  getSpecificMealCalculation
);
router.post(
  "/calc",
  authServices.protect,
  authServices.allowTo("user", "admin"),
  makeCalculationValidator,
  calculateMeal
);

module.exports = router;
