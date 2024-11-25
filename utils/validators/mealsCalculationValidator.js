const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const mealsCalculation = require("../../models/mealsCalculationModel");
const MealCategory = require("../../models/mealsCategoryModel");

exports.makeCalculationValidator = [
  check("mealId")
    .notEmpty()
    .withMessage("mealId required")
    .isMongoId()
    .withMessage("Invalid meal id format")
    .custom((val) => {
      return mealsCalculation.findById(val).then((meal) => {
        if (!meal) {
          throw new Error(`This ID not related to meal`);
        }
      });
    }),
  check("quantities")
    .notEmpty()
    .withMessage("quantities required")
    .isFloat({ min: 1 })
    .withMessage("quantities must be an integer more than 0"),
  validatorMiddleware,
];

const validationMessages = {
  required: (field) => `${field} is required`,
  minLength: (field, length) =>
    `${field} must be at least ${length} characters`,
  maxLength: (field, length) =>
    `${field} must be no longer than ${length} characters`,
  maxValue: (field, value) => `${field} must be less than or equal to ${value}`,
  minValue: (field, value) => `${field} must be at least ${value}`,
};

const nutrientValidation = (field) => [
  body(field)
    .notEmpty()
    .withMessage(validationMessages.required(field))
    .isFloat({ min: 0, max: 10000 })
    .withMessage(validationMessages.minValue(field, 0)),
];

exports.createMealsCalculationValidator = [
  body("title_AR")
    .notEmpty()
    .withMessage(validationMessages.required("Meal Arabic title"))
    .isLength({ min: 3, max: 32 })
    .withMessage(validationMessages.minLength("Meal Arabic title", 3)),

  body("title_EN")
    .notEmpty()
    .withMessage(validationMessages.required("Meal English title"))
    .isLength({ min: 3, max: 32 })
    .withMessage(validationMessages.minLength("Meal English title", 3)),

  body("mealCategory")
    .notEmpty()
    .withMessage(validationMessages.required("Meal category"))
    .isMongoId()
    .withMessage("Invalid Meal category ID")
    .custom(async (val) => {
      const mealCategory = await MealCategory.findById(val);
      if (!mealCategory) {
        throw new Error(`This ID not related to meal category`);
      }
    }),

  body("quantities")
    .notEmpty()
    .withMessage(validationMessages.required("Quantity"))
    .isInt({ min: 1, max: 100 })
    .withMessage(validationMessages.minValue("Quantity", 1)),

  ...nutrientValidation("Calories"),
  ...nutrientValidation("Protein"),
  ...nutrientValidation("Carbohydrates"),
  ...nutrientValidation("Fats"),
  ...nutrientValidation("Fiber"),
  ...nutrientValidation("Sugar"),
  ...nutrientValidation("Vitamin_A"),
  ...nutrientValidation("Vitamin_B1"),
  ...nutrientValidation("Vitamin_B2"),
  ...nutrientValidation("Vitamin_B3"),
  ...nutrientValidation("Vitamin_B5"),
  ...nutrientValidation("Vitamin_B6"),
  ...nutrientValidation("Vitamin_B7"),
  ...nutrientValidation("Vitamin_B9"),
  ...nutrientValidation("Vitamin_B12"),
  ...nutrientValidation("Vitamin_C"),
  ...nutrientValidation("Vitamin_D"),
  ...nutrientValidation("Vitamin_E"),
  ...nutrientValidation("Vitamin_K"),
  ...nutrientValidation("Calcium"),
  ...nutrientValidation("Iron"),
  ...nutrientValidation("Magnesium"),
  ...nutrientValidation("Phosphorus"),
  ...nutrientValidation("Potassium"),
  ...nutrientValidation("Sodium"),
  ...nutrientValidation("Zinc"),
  ...nutrientValidation("Copper"),
  ...nutrientValidation("Manganese"),
  ...nutrientValidation("Selenium"),
  validatorMiddleware,
];

const nutrientValidationForUpdate = (field) => [
  body(field)
    .optional()
    .isFloat({ min: 0, max: 10000 })
    .withMessage(validationMessages.minValue(field, 0)),
];

exports.updateMealsCalculationValidator = [
  check("id").isMongoId().withMessage("Invalid Exercise id format"),

  body("title_AR")
    .optional()
    .isLength({ min: 3, max: 32 })
    .withMessage(validationMessages.minLength("Meal Arabic title", 3)),

  body("title_EN")
    .optional()
    .isLength({ min: 3, max: 32 })
    .withMessage(validationMessages.minLength("Meal English title", 3)),

  body("mealCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid Meal category ID"),

  body("quantities")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage(validationMessages.minValue("Quantity", 1)),

  ...nutrientValidationForUpdate("Calories"),
  ...nutrientValidationForUpdate("Protein"),
  ...nutrientValidationForUpdate("Carbohydrates"),
  ...nutrientValidationForUpdate("Fats"),
  ...nutrientValidationForUpdate("Fiber"),
  ...nutrientValidationForUpdate("Sugar"),
  ...nutrientValidationForUpdate("Vitamin_A"),
  ...nutrientValidationForUpdate("Vitamin_B1"),
  ...nutrientValidationForUpdate("Vitamin_B2"),
  ...nutrientValidationForUpdate("Vitamin_B3"),
  ...nutrientValidationForUpdate("Vitamin_B5"),
  ...nutrientValidationForUpdate("Vitamin_B6"),
  ...nutrientValidationForUpdate("Vitamin_B7"),
  ...nutrientValidationForUpdate("Vitamin_B9"),
  ...nutrientValidationForUpdate("Vitamin_B12"),
  ...nutrientValidationForUpdate("Vitamin_C"),
  ...nutrientValidationForUpdate("Vitamin_D"),
  ...nutrientValidationForUpdate("Vitamin_E"),
  ...nutrientValidationForUpdate("Vitamin_K"),
  ...nutrientValidationForUpdate("Calcium"),
  ...nutrientValidationForUpdate("Iron"),
  ...nutrientValidationForUpdate("Magnesium"),
  ...nutrientValidationForUpdate("Phosphorus"),
  ...nutrientValidationForUpdate("Potassium"),
  ...nutrientValidationForUpdate("Sodium"),
  ...nutrientValidationForUpdate("Zinc"),
  ...nutrientValidationForUpdate("Copper"),
  ...nutrientValidationForUpdate("Manganese"),
  ...nutrientValidationForUpdate("Selenium"),
];

exports.getOneMealsCalculationValidator = [
  check("id").isMongoId().withMessage("Invalid MealsCalculation id format"),
  validatorMiddleware,
];

exports.deleteMealsCalculationValidator = [
  check("id").isMongoId().withMessage("Invalid MealsCalculation id format"),
  validatorMiddleware,
];
