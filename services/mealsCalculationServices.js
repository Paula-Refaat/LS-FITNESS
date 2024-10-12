const mealsCalculation = require("../models/mealsCalculationModel");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("express-async-handler");
const factory = require("./handllerFactory");
const calculateNutritionalValue = require("../utils/calculationFormula");

exports.getMealsCalculation = asyncHandler(async (req, res, next) => {
  const allMealsCalculations = await mealsCalculation.find();
  res.status(200).json({ data: allMealsCalculations });
});

exports.calculateMeal = asyncHandler(async (req, res, next) => {
  const { mealId, quantities } = req.body;

  // Validate inputs
  if (!mealId || !quantities) {
    return next(new ApiError("Meal ID and quantities are required", 400));
  }

  // 1- Get meal from DB
  const meal = await mealsCalculation.findById(mealId);
  if (!meal) {
    return next(new ApiError("No meal found with this ID", 404));
  }

  // 2- Calculate nutritional values based on provided quantities
  try {
    const calculatedNutritionalValues = {
      _id: meal._id,
      title: meal.title,
      calculationData: {
        calories: calculateNutritionalValue(
          meal.quantities,
          meal.calories,
          quantities
        ),
        protein: calculateNutritionalValue(
          meal.quantities,
          meal.proteins,
          quantities
        ),
        carbs: calculateNutritionalValue(
          meal.quantities,
          meal.carbohydrates,
          quantities
        ),
        fats: calculateNutritionalValue(meal.quantities, meal.fats, quantities),
        fibers: calculateNutritionalValue(
          meal.quantities,
          meal.fibers,
          quantities
        ),
      },
    };

    // 3- Return the calculated values
    res.status(200).json({ data: calculatedNutritionalValues });
  } catch (error) {
    return next(new ApiError("Error calculating nutritional values", 500));
  }
});
