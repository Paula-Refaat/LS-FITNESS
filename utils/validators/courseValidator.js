const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const ApiError = require("../ApiError");
const Course = require("../../models/courseModel");
const Category = require("../../models/categoryModel");

exports.createCourseValidator = [
  check("title")
    .isLength({ min: 2 })
    .withMessage("must be at least 2 chars")
    .notEmpty()
    .withMessage("Course required"),

  check("description")
    .notEmpty()
    .withMessage("Course description is required")
    .isLength({ min: 20 })
    .withMessage("Too short description")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),

  // check("sold")
  //   .optional()
  //   .isNumeric()
  //   .withMessage("Course quantity must be a number"),

  check("price")
    .notEmpty()
    .withMessage("Course price is required")
    .isNumeric()
    .withMessage("Course price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),

  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Course priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),

  check("image").notEmpty().withMessage("Course Image Required"),
  check("category")
    .notEmpty()
    .withMessage("Course must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID format")
    // before i add product to category i must check if category is in database
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(new ApiError(`Category Not Found`, 404));
        }
      })
    ),
  //catch error and return it as a response
  validatorMiddleware,
];

exports.updateCourseValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((val, { req }) =>
      Course.findById(val).then((course) => {
        if (!course) {
          return Promise.reject(new Error(`Course not found`));
        }
      })
    ),

  check("title")
    .optional()
    .isLength({ min: 2 })
    .withMessage("must be at least 2 chars")
    .notEmpty()
    .withMessage("Course required"),

  check("description")
    .optional()
    .isLength({ min: 20 })
    .withMessage("Too short description")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),

  // check("sold")
  //   .optional()
  //   .isNumeric()
  //   .withMessage("Course quantity must be a number"),

  check("price")
    .optional()
    .isNumeric()
    .withMessage("Course price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),

  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Course priceAfterDiscount must be a number")
    .toFloat()
    .custom(async (value, { req }) => {
      if (req.body.price) {
        if (req.body.price <= value) {
          throw new Error("priceAfterDiscount must be lower than price");
        }
      } else {
        await Course.findById(req.params.id).then((course) => {
          if (course.price <= value) {
            throw new Error("priceAfterDiscount must be lower than price");
          }
        });
      }
      return true;
    }),

  check("image").optional().notEmpty().withMessage("Course Image Required"),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(new ApiError(`Category Not Found`, 404));
        }
      })
    ),

  validatorMiddleware,
];

exports.checkCourseIdParamValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];

exports.addUserToCourseValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid mongo id ")
    .custom((courseId) =>
      Course.findById(courseId).then((course) => {
        if (!course) {
          return Promise.reject(new ApiError(`course Not Found`, 404));
        }
      })
    ),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),
  validatorMiddleware,
];

exports.checkCourseOwnership = [
  check("id")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((val, { req }) =>
      Course.findById(val).then((course) => {
        if (!course) {
          return Promise.reject(new Error(`Course not found`));
        }
      })
    ),
  validatorMiddleware,
];
