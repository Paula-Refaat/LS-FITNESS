const express = require("express");

const authServices = require("../../services/authServices");
const {
  createQuiz,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getQuizForCourse,
  evaluateQuiz,
  getQuizzes,
} = require("../../services/quizService");
const router = express.Router();

router
  .route("/")
  .post(authServices.protect, authServices.allowTo("admin"), createQuiz)
  .get(authServices.protect, authServices.allowTo("user", "admin"), getQuizzes);
router
  .route("/:id")
  .get(authServices.protect, authServices.allowTo("user", "admin"), getQuizById)
  .put(authServices.protect, authServices.allowTo("admin"), updateQuiz)
  .delete(authServices.protect, authServices.allowTo("admin"), deleteQuiz);

// Get quiz for a specific course
router.get(
  "/getQuizForCourse/:courseId",
  authServices.protect,
  authServices.allowTo("user", "admin"),
  getQuizForCourse
);

// Submit quiz answers and evaluate
router.post(
  "/:quizId/evaluate",
  authServices.protect,
  authServices.allowTo("user", "admin"),
  evaluateQuiz
);
module.exports = router;
