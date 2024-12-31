const express = require("express");
const authServices = require("../../services/authServices");
const {
  createLessonValidator,
  getLessonValidator,
  updateLessonValidator,
  deleteLessonValidator,
} = require("../../utils/validators/lessonsValidator");
const {
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonById,
  resizeMedia,
  uploadLessonMedia,
  getLessons,
  createFilterObj,
  setCourseIdToBody,
  accessLessonsOfMyCourses,
  accessOneLessonOfMyCourse,
  handlingVideoResponse,
  moveLessonToRecycleBin,
  restoreLessonFromRecycleBin,
  filterOnLessonsInTrash,
  filterOnLessonsNotInTrash,
  // eslint-disable-next-line import/newline-after-import
} = require("../../services/lessonServices");
const checkPermission = require("../../middlewares/permissionMiddleware");

const router = express.Router({ mergeParams: true });

// Create a new lesson
router.post(
  "/",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Lesson", "create"),
  uploadLessonMedia,
  resizeMedia,
  setCourseIdToBody,
  handlingVideoResponse,
  createLessonValidator,
  createLesson
);
router.get(
  "/courseLessons/:courseId",
  authServices.protect,
  authServices.allowTo("user", "admin", "sub-admin"),
  checkPermission("Lesson", "read"),
  filterOnLessonsNotInTrash,
  accessLessonsOfMyCourses,
  createFilterObj,
  getLessons
);

// Get a specific lesson by ID
router.get(
  "/:id",
  authServices.protect,
  authServices.allowTo("user", "admin", "sub-admin"),
  checkPermission("Lesson", "read"),
  getLessonValidator,
  accessOneLessonOfMyCourse,
  getLessonById
);

// Update a lesson by ID
router.put(
  "/:id",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Lesson", "update"),
  uploadLessonMedia,
  resizeMedia,
  handlingVideoResponse,
  updateLessonValidator,
  updateLesson
);

// Delete a lesson by ID
router.delete(
  "/:id",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Lesson", "delete"),
  deleteLessonValidator,
  deleteLesson
);

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Lesson", "delete"),
  moveLessonToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Lesson", "delete"),
  restoreLessonFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Lesson", "delete"),
  filterOnLessonsInTrash,
  getLessons
);

module.exports = router;
