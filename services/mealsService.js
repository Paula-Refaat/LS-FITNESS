const fs = require("fs/promises");
const path = require("path");
const MealsModel = require("../models/mealsModel");
const factory = require("./handllerFactory");
const { uploadSingleMedia } = require("../middlewares/uploadImageMiddleware");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const MealCalculationModel = require("../models/mealsCalculationModel");
const calculateNutritionalValue = require("../utils/calculationFormula");

exports.uploadMealImage = uploadSingleMedia("image", "image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const directoryPath = "uploads/meals";

    await fs.mkdir(directoryPath, { recursive: true });

    const imageName = `meals-${uuidv4()}-${Date.now()}.webp`;
    const imagePath = path.join(directoryPath, imageName);

    await fs.writeFile(imagePath, req.file.buffer);

    const nameOfImg = imageName.split(".")[0];

    req.body.image = nameOfImg;
  }

  next();
});

exports.createMeal = factory.createOne(MealsModel);

exports.getAllMeals = factory.getAll(MealsModel, "Meals");

exports.getSpecificMeal = factory.getOne(MealsModel);

exports.updateMeal = factory.updateOne(MealsModel);

exports.deleteMeal = factory.deleteOne(MealsModel);

exports.calculateAllMealIngredients = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { ingredients } = req.body;

  const meal = await MealsModel.findById(id);
  if (!meal) {
    return next(new ApiError("No meal found with this ID", 404));
  }

  mergeCustomRequestedIngredientsIntoMeal(meal, ingredients);

  calculateEachMealIngredients(meal);

  roundMealTotals(meal);

  return res.status(200).json(meal);
});

const mergeCustomRequestedIngredientsIntoMeal = (meal, ingredients) => {
  ingredients.forEach((i) => {
    const isIngredientExist = meal.ingredients.find(
      (ingredient) => String(ingredient._doc._id) === String(i.id)
    );
    if (isIngredientExist) {
      isIngredientExist._doc.customQuantity = i.quantities;
    }
  });
};

const calculateEachMealIngredients = (meal) => {
  meal._doc["total"] = {};

  meal.ingredients.forEach((i) => {
    i = i._doc;

    Object.keys(i)
      .filter((k) => MealCalculationModel.MealCalculationAttributes.includes(k))
      .forEach((attributeKey) => {
        i[attributeKey] = calculateNutritionalValue(
          i.quantities,
          i[attributeKey],
          i?.customQuantity ?? i.quantities
        );

        if (i?.customQuantity) {
          i.quantities = i.customQuantity;
          delete i.customQuantity;
        }

        meal._doc["total"][attributeKey] =
          (meal._doc["total"]?.[attributeKey] ?? 0) + i[attributeKey];
      });

    meal._doc["total"]["quantities"] =
      (meal._doc["total"]?.["quantities"] ?? 0) + +i.quantities;
  });
};

const roundMealTotals = (meal) => {
  Object.keys(meal._doc["total"]).forEach((key) => {
    meal._doc["total"][key] = parseFloat(meal._doc["total"][key].toFixed(2));
  });
};

exports.mergeCalculationInGetAll = asyncHandler(async (req, res, next) => {
  // Save a reference to the original res.send function
  const originalSend = res.json.bind(res);

  // Override res.send to intercept the response data
  res.json = (body) => {
    const meals = body.data;

    meals.forEach((meal) => {
      mergeCustomRequestedIngredientsIntoMeal(meal, []);

      calculateEachMealIngredients(meal);

      roundMealTotals(meal);
    });

    // Send the modified response
    return originalSend(body);
  };

  next();
});

exports.mergeCalculationInGetById = asyncHandler(async (req, res, next) => {
  // Save a reference to the original res.send function
  const originalSend = res.json.bind(res);

  // Override res.send to intercept the response data
  res.json = (body) => {
    const meal = body.data;

    mergeCustomRequestedIngredientsIntoMeal(meal, []);

    calculateEachMealIngredients(meal);

    roundMealTotals(meal);

    // Send the modified response
    return originalSend(body);
  };

  next();
});
