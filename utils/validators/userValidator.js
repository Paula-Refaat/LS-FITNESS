/* eslint-disable no-sparse-arrays */
const bcrypt = require("bcryptjs");
const { check, body } = require("express-validator");
const phonenumberformate = require("../PhoneNumberFormate");
const User = require("../../models/userModel");
// const Category = require("../../models/categoryModel");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getUserValidator = [
  //rules
  check("id").isMongoId().withMessage("Invalid User id format"),
  //catch error
  validatorMiddleware,
];
// const convertInterestsToArray = (req, res, next) => {
//   if (req.body.interests) {
//     if (!Array.isArray(req.body.interests)) {
//       req.body.interests = [req.body.interests];
//     }
//   }
//   next();
// };
exports.createUserValidator = [
  check("username")
    .notEmpty()
    .withMessage("username required")
    .isLength({ min: 2 })
    .withMessage("too short User name")
    .isLength({ max: 100 })
    .withMessage("too long User name"),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in use"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters")
    .isLength({ max: 32 })
    .withMessage("password must be at least 8 characters")
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword) {
        throw new Error("password does not match");
      }
      return true;
    }),

  check("confirmPassword").notEmpty().withMessage("password required"),
  //   convertInterestsToArray,
  //   check("interests")
  //     .optional()
  //     .isArray({ max: 5 })
  //     .withMessage("The maximum number of interests is five")
  //     .custom(async (categoriesIds) => {
  //       const categories = await Category.find({
  //         _id: { $in: categoriesIds },
  //       });
  //       if (!categories || categories.length !== categoriesIds.length) {
  //         throw new Error("Invalid category IDs");
  //       }
  //     }),
  check("phone")
    .optional()
    .isMobilePhone(phonenumberformate())
    .withMessage("Phone number must be a real phone number"),

  check("profileImg").optional(),

  check("role").optional(),

  //   check("gender").isString().withMessage("gender must be a text"),

  //   check("location").isString().withMessage("location must be a text"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("username").optional(),
  check("email")
    .optional()
    .notEmpty()
    .withMessage("email Required")
    .isEmail()
    .withMessage("invalid email address")
    .toLowerCase()
    .custom((val, { req }) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          if (user._id.toString() === req.params.id.toString()) {
            return true;
          } else {
            throw new Error("E-mail already exists");
          }
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(phonenumberformate())
    .withMessage("Phone number must be a real phone number"),

  check("profileImg").optional(),

  check("role").optional(),

  //   check("gender").optional().isString().withMessage("gender must be a text"),

  //   check("location")
  //     .optional()
  //     .isString()
  //     .withMessage("location must be a text"),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];
exports.changeUserPasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Please enter your new password confirm"),
  body("newPassword")
    .notEmpty()
    .withMessage("Please enter your new password")
    .custom(async (val, { req }) => {
      // 1)verify current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("User not found");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Current password is incorrect");
      }
      // 2)verify  password confrim
      if (val !== req.body.confirmPassword) {
        throw new Error("password does not match");
      }
      return true;
    }),
  validatorMiddleware,
];
exports.updateLoggedUserValidator = [
  check("username").optional(),
  check("email")
    .optional()
    .notEmpty()
    .withMessage("email Required")
    .isEmail()
    .withMessage("invalid email address")
    .toLowerCase()
    .custom((val, { req }) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          if (user._id.toString() === req.user._id.toString()) {
            return true;
          } else {
            throw new Error("E-mail already exists");
          }
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(phonenumberformate())
    .withMessage("Phone number must be a real phone number"),

  //   check("gender").optional().isString().withMessage("gender must be a text"),

  //   check("location")
  //     .optional()
  //     .isString()
  //     .withMessage("location must be a text"),
  validatorMiddleware,
];
exports.changeLoggedUserPasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Please enter your new password confirm"),
  body("newPassword")
    .notEmpty()
    .withMessage("Please enter your new password")
    .custom(async (val, { req }) => {
      // 1)verify current password
      const user = await User.findById(req.user._id);
      if (!user) {
        throw new Error("User not found");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Current password is incorrect");
      }
      // 2)verify  password confrim
      if (val !== req.body.confirmPassword) {
        throw new Error("password does not match");
      }
      return true;
    }),
  validatorMiddleware,
];
