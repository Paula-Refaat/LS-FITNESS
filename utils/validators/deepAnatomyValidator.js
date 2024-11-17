const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const DeepAnatomy = require("../../models/deepAnatomyModel");

exports.getDeepAnatomyValidator = [
  //rules
  check("id").isMongoId().withMessage("Invalid DeepAnatomy id format"),
  //catch error
  validatorMiddleware,
];
exports.createDeepAnatomyValidator = [
  check("title")
    .notEmpty()
    .withMessage("DeepAnatomy required")
    .isLength({ min: 3 })
    .withMessage("too short DeepAnatomy title")
    .isLength({ max: 32 })
    .withMessage("too long DeepAnatomy title")
    .customSanitizer((val) =>
      val
        .trim()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
    .custom((val) =>
      DeepAnatomy.findOne({ title: val }).then((deepAnatomy) => {
        if (deepAnatomy) {
          throw new Error(
            `deepAnatomy title already exists and must it to be unique`
          );
        }
      })
    ),

  validatorMiddleware,
];
exports.updateDeepAnatomyValidator = [
  check("id").isMongoId().withMessage("Invalid DeepAnatomy id format"),
  check("title")
    .optional()
    .notEmpty()
    .withMessage("deepAnatomy required")
    .isLength({ min: 3 })
    .withMessage("too short deepAnatomy title")
    .isLength({ max: 32 })
    .withMessage("too long deepAnatomy title")
    .customSanitizer((val) =>
      val
        .trim()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
    .custom((val, { req }) => {
      return DeepAnatomy.findById(req.params.id).then((deepAnatomy) => {
        if (deepAnatomy.title === val) {
          return;
        }
        return DeepAnatomy.findOne({ title: val }).then((deepAnatomy) => {
          if (deepAnatomy) {
            throw new Error(
              `DeepAnatomy title already exists and must it to be unique`
            );
          }
        });
      });
    }),

  validatorMiddleware,
];
exports.deleteDeepAnatomyValidator = [
  check("id").isMongoId().withMessage("Invalid DeepAnatomy id format"),
  validatorMiddleware,
];
