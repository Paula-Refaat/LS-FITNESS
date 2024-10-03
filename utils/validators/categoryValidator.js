const { check } = require("express-validator");
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
    .customSanitizer((val) =>
      val
        .trim()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
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
  check("title")
    .optional()
    .notEmpty()
    .withMessage("category required")
    .isLength({ min: 3 })
    .withMessage("too short category title")
    .isLength({ max: 32 })
    .withMessage("too long category title")
    .customSanitizer((val) =>
      val
        .trim()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
    .custom((val, { req }) => {
      return Category.findById(req.params.id).then((category) => {
        if (category.title === val) {
          return;
        }
        return Category.findOne({ title: val }).then((category) => {
          if (category) {
            throw new Error(
              `category title already exists and must it to be unique`
            );
          }
        });
      });
    }),

  validatorMiddleware,
];
exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];
