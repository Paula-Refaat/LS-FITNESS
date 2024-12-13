const { check, body } = require("express-validator");
const Course = require("../../models/courseModel");
const Quiz = require("../../models/quizModel");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createQuizValidator = [
  // Validate course ID
  check("course")
    .notEmpty()
    .withMessage("Course ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid Course ID format")
    .bail()
    .custom(async (value) => {
      const courseExists = await Course.findById(value);
      if (!courseExists) {
        throw new Error("Course not found");
      }
      const quizExists = await Quiz.findOne({ course: value });
      if (quizExists) {
        throw new Error("A quiz for this course already exists");
      }
      return true;
    }),

  // Validate questions array
  body("questions")
    .isArray({ min: 1 })
    .withMessage("Questions must be an array with at least one question"),

  // Validate each question
  body("questions.*.question")
    .notEmpty()
    .withMessage("Each question must have a question text"),

  body("questions.*.options")
    .isArray({ min: 2 })
    .withMessage("Each question must have at least two options"),

  // Validate each option
  body("questions.*.options.*.key")
    .notEmpty()
    .withMessage("Each option must have a key"),

  body("questions.*.options.*.value")
    .notEmpty()
    .withMessage("Each option must have a value"),

  // Validate correctAnswer
  body("questions.*.correctAnswer")
    .notEmpty()
    .withMessage("Each question must have a correct answer"),

  validatorMiddleware,
];

exports.updateQuizValidator = [
  check("id").isMongoId().withMessage("Invalid MealCategory id format"),

  // Validate course ID
  check("course")
    .optional()
    .isMongoId()
    .withMessage("Invalid Course ID format")
    .bail()
    // .custom(async (value) => {
    //   const courseExists = await Course.findById(value);
    //   if (!courseExists) {
    //     throw new Error("Course not found");
    //   }
    //   return true;
    // }),
    .custom((val, { req }) => {
      return Quiz.findById(req.params.id).then((value) => {
        if (value.course.toString() === val.toString()) {
          return;
        }
        return Quiz.findById(req.params.id).then((value) => {
          if (value) {
            throw new Error("A quiz for this course already exists");
          }
        });
      });
    }),

  // Validate questions array
  body("questions")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Questions must be an array with at least one question"),

  // Validate each question
  body("questions.*.question")
    .optional()
    .notEmpty()
    .withMessage("Each question must have a question text"),

  body("questions.*.options")
    .optional()
    .isArray({ min: 2 })
    .withMessage("Each question must have at least two options"),

  // Validate each option
  body("questions.*.options.*.key")
    .optional()
    .notEmpty()
    .withMessage("Each option must have a key"),

  body("questions.*.options.*.value")
    .optional()
    .notEmpty()
    .withMessage("Each option must have a value"),

  // Validate correctAnswer
  body("questions.*.correctAnswer")
    .optional()
    .notEmpty()
    .withMessage("Each question must have a correct answer"),

  validatorMiddleware,
];
exports.evaluateQuizValidator = [
  // Validate quizId in params
  check("quizId")
    .isMongoId()
    .withMessage("Invalid Quiz ID format")
    .bail()
    .custom(async (value) => {
      const quizExists = await Quiz.findById(value);
      if (!quizExists) {
        throw new Error("Quiz not found");
      }
      return true;
    }),

  // Validate userAnswers in the body
  body("userAnswers")
    .isArray()
    .withMessage("User answers must be an array")
    .bail()
    .custom(async (value, { req }) => {
      // Load the quiz directly from the database
      const quiz = await Quiz.findById(req.params.quizId);
      if (!quiz) {
        throw new Error("Quiz not found");
      }

      // Validate the number of answers
      if (value.length !== quiz.questions.length) {
        throw new Error(
          "Number of answers must match the number of questions in the quiz"
        );
      }

      return true;
    })
    .bail()
    .custom((value) => {
      if (
        value.some(
          (answer) => typeof answer !== "string" && typeof answer !== "number"
        )
      ) {
        throw new Error(
          "Each answer must be a valid answer format (e.g., a string or number)"
        );
      }
      return true;
    }),

  validatorMiddleware,
];
