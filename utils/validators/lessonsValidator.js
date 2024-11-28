const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const ApiError = require("../ApiError");
const Course = require("../../models/courseModel");

exports.createLessonValidator = [
  check("title")
    .isLength({ min: 2 })
    .withMessage("must be at least 2 chars")
    .notEmpty()
    .withMessage("Lesson required"),
  check("course")
    .notEmpty()
    .withMessage("Lesson must be belong to a Course")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((courseId) =>
      Course.findById(courseId).then((course) => {
        if (!course) {
          return Promise.reject(new ApiError(`Course Not Found`, 404));
        }
      })
    ),
  check("videoUrl").notEmpty().withMessage("Lesson videos Required"),

  validatorMiddleware,
];
exports.getLessonValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];

exports.updateLessonValidator = [
  check("id").isMongoId().withMessage("invalid mongo Id "),
  check("title")
    .optional()
    .isString()
    .withMessage("string only allowed")
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage("too short title ")
    .isLength({ max: 125 })
    .withMessage("too long title for Lesson"),

  check("course")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((courseId) =>
      Course.findById(courseId).then((course) => {
        if (!course) {
          return Promise.reject(new ApiError(`Course Not Found`, 404));
        }
      })
    ),

  check("videoUrl").notEmpty().withMessage("Lesson videos Required").optional(),
  validatorMiddleware,
];

exports.deleteLessonValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];
