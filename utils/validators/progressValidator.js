const { check } = require("express-validator");
const Progress = require("../../models/progressModel");
const Exercise = require("../../models/exerciseModel");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.AddToProgressValidator = [
  // check("userId").isMongoId().withMessage("Invalid User id format"),
  check("exerciseId")
    .isMongoId()
    .withMessage("Invalid meal id format")
    .notEmpty()
    .withMessage("exerciseId required")
    .custom((val) => {
      return Exercise.findOne({ _id: val }).then((exercise) => {
        if (!exercise) {
          throw new Error(`This ID not related to exercise`);
        }
      });
    }),
  check("volume")
    .notEmpty()
    .withMessage("volume required")
    .isInt({ min: 1 })
    .withMessage("volume must be an integer more than 0"),

  validatorMiddleware,
];

exports.getProgressByExerciseIdValidator = [
  check("exerciseId")
    .isMongoId()
    .withMessage("Invalid exercise id format")
    .custom((val) => {
      return Exercise.findOne({ _id: val }).then((exercise) => {
        if (!exercise) {
          throw new Error(
            `This exercise ID does not exist in exercise records`
          );
        }
      });
    }),
  validatorMiddleware,
];
