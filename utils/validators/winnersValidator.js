const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const validationMessages = {
  required: (field) => `${field} is required`,
  minLength: (field, length) =>
    `${field} must be at least ${length} characters`,
  maxLength: (field, length) =>
    `${field} must be no longer than ${length} characters`,
};

exports.createWinnerValidator = [
  body("title")
    .notEmpty()
    .withMessage(validationMessages.required("Winner title"))
    .isLength({ min: 3, max: 32 })
    .withMessage(validationMessages.minLength("Winner title", 3)),

  body("description")
    .notEmpty()
    .withMessage(validationMessages.required("Winner description"))
    .isLength({ min: 3, max: 32 })
    .withMessage(validationMessages.minLength("Winner description", 3)),

  validatorMiddleware,
];

exports.updateWinnerValidator = [
  check("id").isMongoId().withMessage("Invalid Winner id format"),
  ...this.createWinnerValidator,
];

exports.getOneWinnerValidator = [
  check("id").isMongoId().withMessage("Invalid Winner id format"),
  validatorMiddleware,
];

exports.deleteWinnerValidator = [...this.getOneWinnerValidator];
