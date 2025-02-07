const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const validationMessages = {
  required: (field) => `${field} is required`,
  minLength: (field, length) =>
    `${field} must be at least ${length} characters`,
  maxLength: (field, length) =>
    `${field} must be no longer than ${length} characters`,
  maxValue: (field, value) => `${field} must be less than or equal to ${value}`,
  minValue: (field, value) => `${field} must be at least ${value}`,
};

exports.createPrizeValidator = [
  body("title_en")
    .notEmpty()
    .withMessage(validationMessages.required("Prize English title"))
    .isLength({ min: 3, max: 32 })
    .withMessage(validationMessages.minLength("Prize English title", 3)),

  body("title_ar")
    .notEmpty()
    .withMessage(validationMessages.required("Prize Arabic title"))
    .isLength({ min: 3, max: 32 })
    .withMessage(validationMessages.minLength("Prize Arabic title", 3)),

  body("description_ar")
    .notEmpty()
    .withMessage(validationMessages.required("Prize Arabic description"))
    .isLength({ min: 3, max: 32 })
    .withMessage(validationMessages.minLength("Prize Arabic description", 3)),

  body("description_en")
    .notEmpty()
    .withMessage(validationMessages.required("Prize English description"))
    .isLength({ min: 3, max: 32 })
    .withMessage(validationMessages.minLength("Prize English description", 3)),

  check("vimeo_video_Url")
    .optional()
    .isURL()
    .withMessage("vimeo_video_Url must be a valid URL"),

  validatorMiddleware,
];

exports.updatePrizeValidator = [
  check("id").isMongoId().withMessage("Invalid Prize id format"),

  ...this.createPrizeValidator,
];

exports.getOnePrizeValidator = [
  check("id").isMongoId().withMessage("Invalid Prize id format"),
  validatorMiddleware,
];

exports.deletePrizeValidator = [...this.getOnePrizeValidator];
