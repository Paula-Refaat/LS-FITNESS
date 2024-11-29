const Quiz = require("../models/quizModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const Course = require("../models/courseModel");
const factory = require("./handllerFactory");

exports.createQuiz = factory.createOne(Quiz);

exports.getQuizzes = factory.getAll(Quiz, "Quiz");

exports.getQuizById = factory.getOne(Quiz);

exports.updateQuiz = factory.updateOne(Quiz);

exports.deleteQuiz = factory.deleteOne(Quiz);

exports.getQuizForCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return next(new ApiError("Course not found", 404));
  }
  if (req.user.role !== "admin" && !course.users.includes(req.user.id)) {
    return next(
      new ApiError(
        `You Are not bought this course please buy it, to access this quiz`,
        400
      )
    );
  }
  // need to get course without correct answers
  const quiz = await Quiz.findOne({ course: req.params.courseId }).select(
    "-questions.correctAnswer"
  );
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
