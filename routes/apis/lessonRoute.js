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
  // eslint-disable-next-line import/newline-after-import
} = require("../../services/lessonServices");
const router = express.Router({ mergeParams: true });

// Create a new lesson
router.post(
  "/",
  authServices.protect,
  authServices.allowTo("admin"),
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
  authServices.allowTo("user", "admin"),
  accessLessonsOfMyCourses,
  createFilterObj,
  getLessons
);

// Get a specific lesson by ID
router.get(
  "/:id",
  authServices.protect,
  authServices.allowTo("user", "admin"),
  getLessonValidator,
  accessOneLessonOfMyCourse,
  getLessonById
);

// Update a lesson by ID
router.put(
  "/:id",
  authServices.protect,
  authServices.allowTo("admin"),
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
  authServices.allowTo("admin"),
  deleteLessonValidator,
  deleteLesson
);

module.exports = router;
