const fs = require("fs/promises");
const path = require("path");
const MealsModel = require("../models/mealsModel");
const factory = require("./handllerFactory");
const { uploadSingleMedia } = require("../middlewares/uploadImageMiddleware");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const MealCalculationModel = require("../models/mealsCalculationModel");
const calculateNutritionalValue = require("../utils/calculationFormula");
const ApiError = require("../utils/ApiError");

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
const { getThumbnailsFromUrl } = require("../utils/getThumbnailsFromUrl");

// Function to get thumbnails using the video ID from Vimeo URL
exports.handlingVideoResponse = async (req, res, next) => {
  const videoResponse = await getThumbnailsFromUrl(req.body.vimeo_video_Url);
  if (!videoResponse || videoResponse.success === false) {
    console.error("Invalid Vimeo URL.");
    return next(new ApiError("Invalid Vimeo URL", 400));
  }
  req.body.video = videoResponse;
  next();
};
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

    const isAlternativeIngredientExist = meal.alternativeIngredients.find(
      (ingredient) => String(ingredient._doc._id) === String(i.id)
    );
    if (isAlternativeIngredientExist) {
      isAlternativeIngredientExist._doc.customQuantity = i.quantities;
    }
  });
};

const calculateEachMealIngredients = (meal) => {
  meal._doc["total"] = {};
  meal._doc["alternativesTotal"] = {};

  meal.ingredients.forEach((i) => {
    i = i._doc;

    Object.keys(i)
      .filter((k) => MealCalculationModel.MealCalculationAttributes.includes(k))
      .forEach((attributeKey) => {
        i[attributeKey] = calculateNutritionalValue(
          i.quantities,
          i[attributeKey],
          i?.customQuantity !== undefined ? i?.customQuantity : i.quantities
        );

        const unit = i[attributeKey].split(" ")[1];

        console.log({ unit, key: attributeKey });

        meal._doc["total"][attributeKey] = `${(
          Number(parseFloat(meal._doc["total"]?.[attributeKey] ?? "0")) +
          Number(parseFloat(i[attributeKey]))
        ).toFixed(2)} ${unit}`;
      });

    if (i?.customQuantity) {
      i.quantities = i.customQuantity;
      delete i.customQuantity;
    }

    const unit = i?.quantities?.split?.(" ")?.[1] ?? "ml";

    meal._doc["total"]["quantities"] = `${
      (Number(parseFloat(meal._doc["total"]?.["quantities"] ?? "0")) || 0) +
      Number(parseFloat(i.quantities))
    } ${unit}`;
  });

  meal.alternativeIngredients.forEach((i) => {
    i = i._doc;

    Object.keys(i)
      .filter((k) => MealCalculationModel.MealCalculationAttributes.includes(k))
      .forEach((attributeKey) => {
        i[attributeKey] = calculateNutritionalValue(
          i.quantities,
          i[attributeKey],
          i?.customQuantity !== undefined ? i?.customQuantity : i.quantities
        );

        const unit = i[attributeKey].split(" ")[1];

        meal._doc["alternativesTotal"][attributeKey] = `${(
          Number(
            parseFloat(meal._doc["alternativesTotal"]?.[attributeKey] ?? "0")
          ) + Number(parseFloat(i[attributeKey]))
        ).toFixed(2)} ${unit}`;
      });

    if (i?.customQuantity) {
      i.quantities = i.customQuantity;
      delete i.customQuantity;
    }

    const unit = i?.quantities?.split?.(" ")?.[1] ?? "ml";

    meal._doc["alternativesTotal"]["quantities"] = `${
      (Number(
        parseFloat(meal._doc["alternativesTotal"]?.["quantities"] ?? "0")
      ) || 0) + Number(parseFloat(i.quantities))
    } ${unit}`;
  });
};

exports.mergeCalculationInGetAll = asyncHandler(async (req, res, next) => {
  // Save a reference to the original res.send function
  const originalSend = res.json.bind(res);

  // Override res.send to intercept the response data
  res.json = (body) => {
    const meals = body.data;

    meals.forEach((meal) => {
      mergeCustomRequestedIngredientsIntoMeal(meal, meal?.ingredient ?? []);

      calculateEachMealIngredients(meal);
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

    mergeCustomRequestedIngredientsIntoMeal(meal, meal?.ingredient ?? []);

    calculateEachMealIngredients(meal);

    // Send the modified response
    return originalSend(body);
  };

  next();
});
