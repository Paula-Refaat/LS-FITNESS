const Quiz = require("../models/quizModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const Course = require("../models/courseModel");
const factory = require("./handllerFactory");

// Filter out Quiz that are not in the trash
exports.filterOnQuizNotInTrash = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }

  // شمل المستندات التي لا تحتوي على isDeleted أو التي isDeleted ليست true
  req.filterObj.$or = [
    { isDeleted: { $exists: false } }, // المستندات التي لا تحتوي على isDeleted
    { isDeleted: false }, // المستندات التي isDeleted = false
  ];

  next();
};

// Filter out Quiz that are in the trash
exports.filterOnQuizInTrash = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }

  req.filterObj.isDeleted = true;

  next();
};

exports.createQuiz = factory.createOne(Quiz);

exports.getQuizzes = factory.getAll(Quiz, "Quiz");

exports.getQuizById = factory.getOne(Quiz);

exports.updateQuiz = factory.updateOne(Quiz);

exports.deleteQuiz = factory.deleteOne(Quiz);

exports.moveQuizToRecycleBin = factory.moveToRecycleBin(Quiz);
exports.restoreQuizFromRecycleBin = factory.restoreFromRecycleBin(Quiz);

exports.getQuizForCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return next(new ApiError("Course not found", 404));
  }

  // Check if user is admin or has purchased the course
  if (req.user.role !== "admin" && !course.users.includes(req.user.id)) {
    return next(
      new ApiError(
        `You are not bought this course, please buy it to access this quiz`,
        400
      )
    );
  }

  // If the user is admin, return quiz with answers, else return quiz without answers
  let quiz;
  if (req.user.role === "admin") {
    // Return the quiz with correct answers for admin
    quiz = await Quiz.findOne({ course: req.params.courseId });
  } else {
    // Return the quiz without correct answers for non-admin users
    quiz = await Quiz.findOne({ course: req.params.courseId }).select(
      "-questions.correctAnswer"
    );
  }

  if (!quiz) {
    return next(new ApiError("Quiz not found", 404));
  }

  res.status(200).json({ data: quiz });
});

exports.evaluateQuiz = asyncHandler(async (req, res, next) => {
  let correctCount = 0;

  const { userAnswers } = req.body;
  const quiz = await Quiz.findById(req.params.quizId);
  quiz.questions.forEach((question, index) => {
    if (userAnswers[index] === question.correctAnswer) {
      correctCount++;
    }
  });

  const score = (correctCount / quiz.questions.length) * 100;

  res.status(200).json({
    data: {
      score,
      correctCount,
      totalQuestions: quiz.questions.length,
      percentage: Math.round(score),
    },
  });
});
