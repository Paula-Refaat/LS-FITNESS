const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Coupon = require("../../models/couponModel");

exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon name required")
    .custom((val) =>
      Coupon.findOne({ name: val }).then((coupon) => {
        if (coupon) {
          throw new Error(`Coupon already exists`);
        }
      })
    ),
  check("expire")
    .notEmpty()
    .withMessage("Coupon expiration date is required")
    .isDate()
    .withMessage("Coupon expiration date is not valid")
    .custom((val, { req }) => {
      const expirationDate = new Date(val);
      const currentDate = new Date();

      // Ensure comparison is done based on the same time zone and time is reset for the date comparison
      if (expirationDate < currentDate) {
        throw new Error("Coupon expiration date must be in the future");
      }
      return true;
    }),
  // check("numberOfUsage")
  //   .optional()
  //   .notEmpty()
  //   .withMessage("Coupon number Of Usage required")
  //   .isNumeric()
  //   .withMessage("Coupon number Of Usage must be a number"),
  // // .isFloat({ min: 1 })
  // // .withMessage("Coupon number Of Usage must be a positive number"),
  check("discount")
    .notEmpty()
    .withMessage("Coupon discount required")
    .isNumeric()
    .withMessage("Coupon discount must be a number")
    .isFloat({ min: 1 })
    .withMessage("Coupon discount must be a positive number"),
  validatorMiddleware,
];
exports.getCouponValidator = [
  check("id").isMongoId().withMessage("Invalid id formate"),
  validatorMiddleware,
];
exports.updateCouponValidator = [
  check("id").isMongoId().withMessage("Invalid id formate"),
  check("name")
    .optional()
    .notEmpty()
    .withMessage("Coupon name required")
    .custom((val, { req }) =>
      Coupon.findOne({ name: val }).then((coupon) => {
        if (coupon) {
          if (coupon._id.toString() !== req.params.id)
            return Promise.reject(new Error("Coupon already exists"));
        }
      })
    ),
  check("expire")
    .optional()
    .notEmpty()
    .withMessage("Coupon expiration date is required")
    .isDate()
    .withMessage("Coupon expiration date is not valid")
    .custom((val, { req }) => {
      const expirationDate = new Date(val);
      const currentDate = new Date();

      // Ensure comparison is done based on the same time zone and time is reset for the date comparison
      if (expirationDate < currentDate) {
        throw new Error("Coupon expiration date must be in the future");
      }
      return true;
    }),
  // check("numberOfUsage")
  //   .optional()
  //   .notEmpty()
  //   .withMessage("Coupon number Of Usage required")
  //   .isNumeric()
  //   .withMessage("Coupon number Of Usage must be a number"),
  // // .isFloat({ min: 1 })
  // // .withMessage("Coupon number Of Usage must be a positive number"),
  check("discount")
    .optional()
    .notEmpty()
    .withMessage("Coupon discount required")
    .isNumeric()
    .withMessage("Coupon discount must be a number")
    .isFloat({ min: 1 })
    .withMessage("Coupon discount must be a positive number"),
  validatorMiddleware,
];
exports.deleteCouponValidator = [
  check("id").isMongoId().withMessage("Invalid id formate"),
  validatorMiddleware,
];
