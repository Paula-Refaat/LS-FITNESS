const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const BodyPart = require("../../models/bodyPartModel");

exports.getBodyPartValidator = [
  //rules
  check("id").isMongoId().withMessage("Invalid BodyPart id format"),
  //catch error
  validatorMiddleware,
];
exports.createBodyPartValidator = [
  check("title")
    .notEmpty()
    .withMessage("BodyPart required")
    .isLength({ min: 3 })
    .withMessage("too short BodyPart title")
    .isLength({ max: 32 })
    .withMessage("too long BodyPart title")
    .customSanitizer((val) =>
      val
        .trim()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
    .custom((val) =>
      BodyPart.findOne({ title: val }).then((bodyPart) => {
        if (bodyPart) {
          throw new Error(
            `bodyPart title already exists and must it to be unique`
          );
        }
      })
    ),

  validatorMiddleware,
];
exports.updateBodyPartValidator = [
  check("id").isMongoId().withMessage("Invalid BodyPart id format"),
  check("title")
    .optional()
    .notEmpty()
    .withMessage("BodyPart required")
    .isLength({ min: 3 })
    .withMessage("too short BodyPart title")
    .isLength({ max: 32 })
    .withMessage("too long BodyPart title")
    .customSanitizer((val) =>
      val
        .trim()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
    .custom((val, { req }) => {
      return BodyPart.findById(req.params.id).then((bodyPart) => {
        if (bodyPart.title === val) {
          return;
        }
        return BodyPart.findOne({ title: val }).then((bodyPart) => {
          if (bodyPart) {
            throw new Error(
              `bodyPart title already exists and must it to be unique`
            );
          }
        });
      });
    }),

  validatorMiddleware,
];
exports.deleteBodyPartValidator = [
  check("id").isMongoId().withMessage("Invalid BodyPart id format"),
  validatorMiddleware,
];
