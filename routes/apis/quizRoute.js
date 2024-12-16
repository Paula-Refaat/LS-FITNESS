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
  moveQuizToRecycleBin,
  restoreQuizFromRecycleBin,
  filterOnQuizNotInTrash,
  filterOnQuizInTrash,
} = require("../../services/quizService");
const {
  createQuizValidator,
  updateQuizValidator,
  evaluateQuizValidator,
} = require("../../utils/validators/quizeValidator");
const router = express.Router();

router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowTo("admin"),
    createQuizValidator,
    createQuiz
  )
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin"),
    filterOnQuizNotInTrash,
    getQuizzes
  );
router
  .route("/:id")
  .get(authServices.protect, authServices.allowTo("user", "admin"), getQuizById)
  .put(
    authServices.protect,
    authServices.allowTo("admin"),
    updateQuizValidator,
    updateQuiz
  )
  .delete(authServices.protect, authServices.allowTo("admin"), deleteQuiz);

// Get quiz for a specific course
router.get(
  "/getQuizForCourse/:courseId",
  authServices.protect,
  authServices.allowTo("user", "admin"),
  filterOnQuizNotInTrash,
  getQuizForCourse
);

// Submit quiz answers and evaluate
router.post(
  "/:quizId/evaluate",
  authServices.protect,
  authServices.allowTo("user", "admin"),
  evaluateQuizValidator,
  evaluateQuiz
);

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("admin"),
  moveQuizToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("admin"),
  restoreQuizFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("admin"),
  filterOnQuizInTrash,
  getQuizzes
);
module.exports = router;
