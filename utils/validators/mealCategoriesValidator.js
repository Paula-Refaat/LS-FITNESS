const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
// const MealCategory = require("../../models/mealsCategoryModel");

exports.createMealCategoryValidator = [
  check("title_AR")
    .notEmpty()
    .withMessage("title_AR required")
    .isLength({ min: 3 })
    .withMessage("too short title_AR")
    .isLength({ max: 100 })
    .withMessage("too long title_AR"),
  check("title_EN")
    .notEmpty()
    .withMessage("title_EN required")
    .isLength({ min: 3 })
    .withMessage("too short title_EN")
    .isLength({ max: 100 })
    .withMessage("too long title_EN"),
  validatorMiddleware,
];

exports.updateMealCategoryValidator = [
  check("title_AR")
    .optional()
    .notEmpty()
    .withMessage("title_AR required")
    .isLength({ min: 3 })
    .withMessage("too short title_AR")
    .isLength({ max: 100 })
    .withMessage("too long title_AR"),
  check("title_EN")
    .optional()
    .notEmpty()
    .withMessage("title_EN required")
    .isLength({ min: 3 })
    .withMessage("too short title_EN")
    .isLength({ max: 100 })
    .withMessage("too long title_EN"),
  validatorMiddleware,
];

exports.getOneMealCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid MealCategory id format"),
  validatorMiddleware,
];

exports.deleteMealCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid MealCategory id format"),
  validatorMiddleware,
];
