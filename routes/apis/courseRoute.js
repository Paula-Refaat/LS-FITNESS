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
const checkPermission = require("../../middlewares/permissionMiddleware");

// nested routes
const lessonRoute = require("./lessonRoute");

const router = express.Router({ mergeParams: true });

router.use("/:courseId/lessons", lessonRoute);

router.get(
  "/MyCourses",
  authServices.protect,
  authServices.allowTo("admin", "user", "sub-admin", "Ls-trainer", "trainer"),
  checkPermission("Course", "read"),
  createFilterObjToGetMyCourses,
  getAllCourses
);

// get course users
router.get(
  "/:id/courseUsers",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("Course", "read"),
  checkCourseOwnership,
  getCourseUsers
);

// Create a new course
router.post(
  "/",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("Course", "create"),
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
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("Course", "update"),
  uploadCourseImage,
  resizeImage,
  updateCourseValidator,
  updateCourse
);

// Delete a course by ID
router.delete(
  "/:id",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("Course", "delete"),
  checkCourseIdParamValidator,
  deleteCourse
);

// add user to course list
router.post(
  "/:id/addUserToCourse",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("Course", "create"),
  addUserToCourseValidator,
  addUserToCourse
);
// Applying coupon on the course
router.post("/:courseId/applyCoupon", applyCouponOnCourse);

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("Course", "delete"),
  moveCourseToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("Course", "delete"),
  restoreCourseFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("Course", "delete"),
  filterOnCoursesInTrash,
  getAllCourses
);
module.exports = router;
