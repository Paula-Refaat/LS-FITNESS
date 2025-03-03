const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const MealCategory = require("../../models/mealsCategoryModel");

const validationMessages = {
  required: (field) => `${field} is required`,
  minLength: (field, length) =>
    `${field} must be at least ${length} characters`,
  maxLength: (field, length) =>
    `${field} must be no longer than ${length} characters`,
  maxValue: (field, value) => `${field} must be less than or equal to ${value}`,
  minValue: (field, value) => `${field} must be at least ${value}`,
};

exports.createMealsValidator = [
  body("title_en")
    .notEmpty()
    .withMessage(validationMessages.required("Meal English title"))
    .isLength({ min: 3, max: 32 })
    .withMessage(validationMessages.minLength("Meal English title", 3)),

  body("title_ar")
    .notEmpty()
    .withMessage(validationMessages.required("Meal Arabic title"))
    .isLength({ min: 3, max: 32 })
    .withMessage(validationMessages.minLength("Meal Arabic title", 3)),

  body("description_ar")
    .notEmpty()
    .withMessage(validationMessages.required("Meal Arabic description"))
    .isLength({ min: 3, max: 32 })
    .withMessage(validationMessages.minLength("Meal Arabic description", 3)),

  body("description_en")
    .notEmpty()
    .withMessage(validationMessages.required("Meal English description"))
    .isLength({ min: 3, max: 32 })
    .withMessage(validationMessages.minLength("Meal English description", 3)),

  check("vimeo_video_Url")
    .notEmpty()
    .withMessage("vimeo_video_Url required")
    .isURL()
    .withMessage("vimeo_video_Url must be a valid URL"),

  body("howToMakeSteps")
    .isString()
    .withMessage("howToMakeSteps must be an string")
    .customSanitizer((stepsString) => {
      try {
        const steps = JSON.parse(stepsString);

        steps.forEach((step, index) => {
          if (!step.stepOrder || !step.stepText_en || !step.stepText_ar) {
            throw new Error(
              `howToMakeSteps[${index}] must have stepOrder, stepText_en, and stepText_ar`
            );
          }
        });

        return steps;
      } catch (err) {
        throw new Error(err?.message ?? err);
      }

      return true;
    }),

  body("ingredients")
    .isArray()
    .withMessage("ingredients must be an array")
    .custom((ingredients) => {
      ingredients.forEach((ingredient, index) => {
        if (!ingredient) {
          throw new Error(`ingredients[${index}] must be a valid object id`);
        }
      });
      return true;
    }),

  body("category")
    .notEmpty()
    .withMessage(validationMessages.required("Meal category"))
    .isMongoId()
    .withMessage("Invalid Meal category ID")
    .custom(async (val) => {
      const mealCategory = await MealCategory.findOne({
        _id: val,
        targetModel: "Meals",
      });
      if (!mealCategory) {
        throw new Error(`This ID not related to meal category`);
      }
    }),

  validatorMiddleware,
];

exports.updateMealsValidator = [
  check("id").isMongoId().withMessage("Invalid Meal id format"),

  ...this.createMealsValidator,
];

exports.getOneMealsValidator = [
  check("id").isMongoId().withMessage("Invalid Meals id format"),
  validatorMiddleware,
];

exports.deleteMealsValidator = [
  check("id").isMongoId().withMessage("Invalid Meals id format"),
  validatorMiddleware,
];

exports.calculateAllMealIngredientsValidator = [
  body("ingredients")
    .isArray()
    .withMessage("ingredients must be an array")
    .custom((ingredients) => {
      ingredients.forEach((ingredient, index) => {
        if (!ingredient.id) {
          throw new Error(
            `ingredients[${index}].id is required and must be a valid object id`
          );
        }
        if (
          ingredient.quantities &&
          typeof ingredient.quantities !== "number"
        ) {
          throw new Error(`ingredients[${index}].quantities must be a number`);
        }
        // Default quantity if not provided
        ingredient.quantities = ingredient.quantities || 100;
      });
      return true;
    }),

  validatorMiddleware,
];
