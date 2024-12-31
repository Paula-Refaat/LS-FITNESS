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
const checkPermission = require("../../middlewares/permissionMiddleware");

const router = express.Router();

router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Quiz", "create"),
    createQuizValidator,
    createQuiz
  )
  .get(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin", "user"),
    checkPermission("Quiz", "read"),
    filterOnQuizNotInTrash,
    getQuizzes
  );
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin", "user"),
    checkPermission("Quiz", "read"),
    getQuizById
  )
  .put(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Quiz", "update"),
    updateQuizValidator,
    updateQuiz
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Quiz", "delete"),
    deleteQuiz
  );

// Get quiz for a specific course
router.get(
  "/getQuizForCourse/:courseId",
  authServices.protect,
  authServices.allowTo("user", "admin", "sub-admin"),
  checkPermission("Quiz", "read"),
  filterOnQuizNotInTrash,
  getQuizForCourse
);

// Submit quiz answers and evaluate
router.post(
  "/:quizId/evaluate",
  authServices.protect,
  authServices.allowTo("user", "admin", "sub-admin"),
  checkPermission("Quiz", "create"),
  evaluateQuizValidator,
  evaluateQuiz
);

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Quiz", "delete"),
  moveQuizToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Quiz", "delete"),
  restoreQuizFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Quiz", "delete"),
  filterOnQuizInTrash,
  getQuizzes
);
module.exports = router;
