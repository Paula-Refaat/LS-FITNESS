const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const mealsCalculation = require("../../models/mealsCalculationModel");

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
