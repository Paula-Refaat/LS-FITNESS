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
  setCategoryIdToBody,
  applyCouponOnCourse,
  moveCourseToRecycleBin,
  restoreCourseFromRecycleBin,
  filterOnCoursesInTrash,
  filterOnCoursesNotInTrash,
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
  setCategoryIdToBody,
  createCourseValidator,
  createCourse
);

// Get all courses
router.get(
  "/",
  authServices.protect,
  createFilterObj,
  filterOnCoursesNotInTrash,
  getAllCourses
);

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
// Applying coupon on the course
router.post("/:courseId/applyCoupon", applyCouponOnCourse);

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("admin"),
  moveCourseToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("admin"),
  restoreCourseFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("admin"),
  filterOnCoursesInTrash,
  getAllCourses
);
module.exports = router;
