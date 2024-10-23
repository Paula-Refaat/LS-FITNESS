const express = require("express");
const {
  getMealsCalculation,
  calculateMeal,
} = require("../../services/mealsCalculationServices");
const {
  makeCalculationValidator,
} = require("../../utils/validators/mealsCalculationValidator");

const router = express.Router();

router.get("/", getMealsCalculation);
router.post("/calc", makeCalculationValidator, calculateMeal);

module.exports = router;
