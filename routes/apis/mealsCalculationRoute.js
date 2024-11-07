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

router.get("/", getMealsCalculation);
router.get("/:id", getSpecificMealCalculation);
router.post("/calc", makeCalculationValidator, calculateMeal);

module.exports = router;
