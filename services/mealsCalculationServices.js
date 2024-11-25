const mealsCalculation = require("../models/mealsCalculationModel");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("express-async-handler");
const factory = require("./handllerFactory");
const calculateNutritionalValue = require("../utils/calculationFormula");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleMedia } = require("../middlewares/uploadImageMiddleware");
const fs = require("fs/promises");
const path = require("path");

//upload Single image
exports.uploadMealCalculationImage = uploadSingleMedia("image", "image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const directoryPath = "uploads/mealsCalculations";

    // Ensure the directory exists
    await fs.mkdir(directoryPath, { recursive: true });

    const imageName = `mealsCalculations-${uuidv4()}-${Date.now()}.png`;
    const imagePath = path.join(directoryPath, imageName);

    // Save the image buffer asynchronously
    await fs.writeFile(imagePath, req.file.buffer);

    // Remove img extension before save it in db
    const nameOfImg = imageName.split(".")[0];
    // Save the image name into the request body to update the database later
    req.body.image = nameOfImg;
  }

  next();
});

//@desc create meals calculation
//@route POST /api/v1/mealsCalculation
//@access protected
exports.createMealsCalculation = factory.createOne(mealsCalculation);

//@desc get all meals calculation
//@route GET /api/v1/mealsCalculation
//@access protected
exports.getMealsCalculation = factory.getAll(
  mealsCalculation,
  "MealsCalculation"
);

//@desc get specific meals calculation by id
//@route GET /api/v1/mealsCalculation/:id
//@access protected
exports.getSpecificMealCalculation = factory.getOne(mealsCalculation);

//@desc calculate meal nutritional values
//@route POST /api/v1/mealsCalculation/calc
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
      title_AR: meal.title_AR,
      title_EN: meal.title_EN,
      mealCategory: meal.mealCategory,
      image: meal.image,
      calculationData: {
        Calories: calculateNutritionalValue(
          meal.quantities,
          meal.Calories,
          quantities
        ),
        Protein: calculateNutritionalValue(
          meal.quantities,
          meal.Protein,
          quantities
        ),
        Carbohydrates: calculateNutritionalValue(
          meal.quantities,
          meal.Carbohydrates,
          quantities
        ),
        Fats: calculateNutritionalValue(meal.quantities, meal.Fats, quantities),
        Fiber: calculateNutritionalValue(
          meal.quantities,
          meal.Fiber,
          quantities
        ),
        Sugar: calculateNutritionalValue(
          meal.quantities,
          meal.Sugar,
          quantities
        ),
        Vitamin_A: calculateNutritionalValue(
          meal.quantities,
          meal.Vitamin_A,
          quantities
        ),
        Vitamin_B1: calculateNutritionalValue(
          meal.quantities,
          meal.Vitamin_B1,
          quantities
        ),
        Vitamin_B2: calculateNutritionalValue(
          meal.quantities,
          meal.Vitamin_B2,
          quantities
        ),
        Vitamin_B3: calculateNutritionalValue(
          meal.quantities,
          meal.Vitamin_B3,
          quantities
        ),
        Vitamin_B5: calculateNutritionalValue(
          meal.quantities,
          meal.Vitamin_B5,
          quantities
        ),
        Vitamin_B6: calculateNutritionalValue(
          meal.quantities,
          meal.Vitamin_B6,
          quantities
        ),
        Vitamin_B7: calculateNutritionalValue(
          meal.quantities,
          meal.Vitamin_B7,
          quantities
        ),
        Vitamin_B9: calculateNutritionalValue(
          meal.quantities,
          meal.Vitamin_B9,
          quantities
        ),
        Vitamin_B12: calculateNutritionalValue(
          meal.quantities,
          meal.Vitamin_B12,
          quantities
        ),
        Vitamin_C: calculateNutritionalValue(
          meal.quantities,
          meal.Vitamin_C,
          quantities
        ),
        Vitamin_D: calculateNutritionalValue(
          meal.quantities,
          meal.Vitamin_D,
          quantities
        ),
        Vitamin_E: calculateNutritionalValue(
          meal.quantities,
          meal.Vitamin_E,
          quantities
        ),
        Vitamin_K: calculateNutritionalValue(
          meal.quantities,
          meal.Vitamin_K,
          quantities
        ),
        Calcium: calculateNutritionalValue(
          meal.quantities,
          meal.Calcium,
          quantities
        ),
        Iron: calculateNutritionalValue(meal.quantities, meal.Iron, quantities),
        Magnesium: calculateNutritionalValue(
          meal.quantities,
          meal.Magnesium,
          quantities
        ),
        Phosphorus: calculateNutritionalValue(
          meal.quantities,
          meal.Phosphorus,
          quantities
        ),
        Potassium: calculateNutritionalValue(
          meal.quantities,
          meal.Potassium,
          quantities
        ),
        Sodium: calculateNutritionalValue(
          meal.quantities,
          meal.Sodium,
          quantities
        ),
        Zinc: calculateNutritionalValue(meal.quantities, meal.Zinc, quantities),
        Copper: calculateNutritionalValue(
          meal.quantities,
          meal.Copper,
          quantities
        ),

        Manganese: calculateNutritionalValue(
          meal.quantities,
          meal.Manganese,
          quantities
        ),

        Selenium: calculateNutritionalValue(
          meal.quantities,
          meal.Selenium,
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

//@desc update meals calculation
//@route PUT /api/v1/mealsCalculation/:id
//@access protected
exports.updateMealsCalculation = factory.updateOne(mealsCalculation);

//@desc delete meals calculation
//@route DELETE /api/v1/mealsCalculation/:id
//@access protected
exports.deleteMealsCalculation = factory.deleteOne(mealsCalculation);
