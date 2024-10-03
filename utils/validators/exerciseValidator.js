const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Exercise = require("../../models/exerciseModel");
const Category = require("../../models/categoryModel");
const BodyPart = require("../../models/bodyPartModel");

exports.getExerciseValidator = [
  //rules
  check("id").isMongoId().withMessage("Invalid exercise id format"),
  //catch error
  validatorMiddleware,
];
exports.createExerciseValidator = [
  check("title")
    .notEmpty()
    .withMessage("Exercise required")
    .isLength({ min: 3 })
    .withMessage("too short Exercise title")
    .isLength({ max: 32 })
    .withMessage("too long Exercise title")
    .customSanitizer((val) =>
      val
        .trim()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
    .custom((val) =>
      Exercise.findOne({ title: val }).then((exercise) => {
        if (exercise) {
          throw new Error(
            `Exercise title already exists and must it to be unique`
          );
        }
      })
    ),
  check("category")
    .notEmpty()
    .withMessage("category required")
    .isMongoId()
    .withMessage("Invalid category id format")
    .custom((val) => {
      return Category.findById(val).then((category) => {
        if (!category) {
          throw new Error(`This ID not related to category`);
        }
      });
    }),
  check("bodyPart")
    .notEmpty()
    .withMessage("bodyPart required")
    .isMongoId()
    .withMessage("Invalid BodyPart id format")
    .custom((val) => {
      return BodyPart.findById(val).then((bodyPart) => {
        if (!bodyPart) {
          throw new Error(`This ID not related to bodyPart`);
        }
      });
    }),
  check("targetGender")
    .notEmpty()
    .withMessage("targetGender required")
    .toLowerCase()
    .isIn(["men", "women"])
    .withMessage("targetGender must be men or women"),
  check("videoUrl")
    .notEmpty()
    .withMessage("videoUrl required")
    .isURL()
    .withMessage("videoUrl must be a valid URL")
    .custom((val, { req }) => {
      return Exercise.findOne({ videoUrl: val }).then((exercise) => {
        if (exercise) {
          throw new Error(`videoUrl already exists and must it to be unique`);
        }
      });
    }),
  check("instructions")
    .optional()
    .isLength({ min: 10 })
    .withMessage("too short instructions")
    .isLength({ max: 1000 })
    .withMessage("too long instructions"),
  validatorMiddleware,
];
exports.updateExerciseValidator = [
  check("id").isMongoId().withMessage("Invalid Exercise id format"),
  check("title")
    .optional()
    .notEmpty()
    .withMessage("Exercise required")
    .isLength({ min: 3 })
    .withMessage("too short Exercise title")
    .isLength({ max: 32 })
    .withMessage("too long Exercise title")
    .customSanitizer((val) =>
      val
        .trim()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
    .custom((val, { req }) => {
      return Exercise.findById(req.params.id).then((exercise) => {
        if (exercise.title === val) {
          return;
        }
        return Exercise.findOne({ title: val }).then((exercise) => {
          if (exercise) {
            throw new Error(
              `Exercise title already exists and must it to be unique`
            );
          }
        });
      });
    }),
  check("category")
    .optional()
    .notEmpty()
    .withMessage("category required")
    .isMongoId()
    .withMessage("Invalid category id format"),
  check("bodyPart")
    .optional()
    .notEmpty()
    .withMessage("bodyPart required")
    .isMongoId()
    .withMessage("Invalid BodyPart id format"),
  check("targetGender")
    .optional()
    .notEmpty()
    .withMessage("targetGender required")
    .toLowerCase()
    .isIn(["men", "women"])
    .withMessage("targetGender must be men or women"),
  check("videoUrl")
    .optional()
    .notEmpty()
    .withMessage("videoUrl required")
    .isURL()
    .withMessage("videoUrl must be a valid URL")
    .custom((val, { req }) => {
      return Exercise.findById(req.params.id).then((exercise) => {
        if (exercise.videoUrl === val) {
          return;
        }
        return Exercise.findOne({ videoUrl: val }).then((exercise) => {
          if (exercise) {
            throw new Error(
              `Exercise video Url already exists and must it to be unique`
            );
          }
        });
      });
    }),
  check("instructions")
    .optional()
    .isLength({ min: 10 })
    .withMessage("too short instructions")
    .isLength({ max: 1000 })
    .withMessage("too long instructions"),

  validatorMiddleware,
];
exports.deleteExerciseValidator = [
  check("id").isMongoId().withMessage("Invalid Exercise id format"),
  validatorMiddleware,
];
