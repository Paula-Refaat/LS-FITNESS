const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");

exports.getCategoryValidator = [
  //rules
  check("id").isMongoId().withMessage("Invalid category id format"),
  //catch error
  validatorMiddleware,
];
exports.createCategoryValidator = [
  check("title")
    .notEmpty()
    .withMessage("category required")
    .isLength({ min: 3 })
    .withMessage("too short category title")
    .isLength({ max: 32 })
    .withMessage("too long category title")
    .custom((val) =>
      Category.findOne({ title: val }).then((category) => {
        if (category) {
          throw new Error(
            `category title already exists and must it to be unique`
          );
        }
      })
    ),

  validatorMiddleware,
];
exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  body("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("too short category title")
    .isLength({ max: 32 })
    .withMessage("too long category title"),

  validatorMiddleware,
];
exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];
