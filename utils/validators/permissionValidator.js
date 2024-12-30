const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
// const MealCategory = require("../../models/mealsCategoryModel");

exports.createPermissionValidator = [
  check("userId")
    .notEmpty()
    .withMessage("userId required")
    .isMongoId()
    .withMessage("Invalid userId format"),
  check("create")
    .optional()
    .isBoolean()
    .withMessage("Invalid create permission"),
  check("read").optional().isBoolean().withMessage("Invalid read permission"),
  check("fullAccess")
    .optional()
    .isBoolean()
    .withMessage("Invalid fullAccess permission"),
  validatorMiddleware,
];
