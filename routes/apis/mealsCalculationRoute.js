const express = require("express");
const {
  getMealsCalculation,
  calculateMeal,
} = require("../../services/mealsCalculationServices");

const router = express.Router();

router.get("/", getMealsCalculation);
router.post("/calc", calculateMeal);

module.exports = router;
