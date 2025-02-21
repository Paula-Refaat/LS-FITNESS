const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createCustomTrainingPlanValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),

  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["exercises", "meals"])
    .withMessage("Type must be either 'exercises' or 'meals'"),

  validatorMiddleware,
];

exports.getCustomTrainingPlanValidator = [
  check("id").isMongoId().withMessage("Invalid training plan ID format"),
  validatorMiddleware,
];

exports.updateCustomTrainingPlanValidator = [
  check("id").isMongoId().withMessage("Invalid training plan ID format"),
  ...exports.createCustomTrainingPlanValidator,
  validatorMiddleware,
];

exports.deleteCustomTrainingPlanValidator = [
  check("id").isMongoId().withMessage("Invalid training plan ID format"),
  validatorMiddleware,
];
