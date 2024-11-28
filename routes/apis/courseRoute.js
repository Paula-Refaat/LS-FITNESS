const express = require("express");

const {
  checkCourseIdParamValidator,
  createCourseValidator,
  updateCourseValidator,
  checkCourseOwnership,
  addUserToCourseValidator,
} = require("../../utils/validators/courseValidator");
const {
  createCourse,
  getAllCourses,
  createFilterObj,
  getCourseById,
  deleteCourse,
  updateCourse,
  addUserToCourse,
  getCourseUsers,
  createFilterObjToGetMyCourses,
  uploadCourseImage,
  resizeImage,
} = require("../../services/courseService");
const authServices = require("../../services/authServices");
// nested routes
const lessonRoute = require("./lessonRoute");

const router = express.Router({ mergeParams: true });

router.use("/:courseId/lessons", lessonRoute);

router.get(
  "/MyCourses",
  authServices.protect,
  authServices.allowTo("admin", "user"),
  createFilterObjToGetMyCourses,
  getAllCourses
);

// get course users
router.get(
  "/:id/courseUsers",
  authServices.protect,
  authServices.allowTo("admin"),
  checkCourseOwnership,
  getCourseUsers
);

// Create a new course
router.post(
  "/",
  authServices.protect,
  authServices.allowTo("admin"),
  uploadCourseImage,
  resizeImage,
  createCourseValidator,
  createCourse
);

// Get all courses
router.get("/", authServices.protect, getAllCourses);

// Get a specific course by ID
router.get(
  "/:id",
  authServices.protect,
  checkCourseIdParamValidator,
  getCourseById
);

// Update a course by ID
router.put(
  "/:id",
  authServices.protect,
  authServices.allowTo("admin"),
  uploadCourseImage,
  resizeImage,
  updateCourseValidator,
  updateCourse
);

// Delete a course by ID
router.delete(
  "/:id",
  authServices.protect,
  authServices.allowTo("admin"),
  checkCourseIdParamValidator,
  deleteCourse
);

// add user to course list
router.post(
  "/:id/addUserToCourse",
  authServices.protect,
  authServices.allowTo("admin"),
  addUserToCourseValidator,
  addUserToCourse
);

module.exports = router;
