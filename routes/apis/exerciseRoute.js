const express = require("express");

const {
  getExerciseValidator,
  createExerciseValidator,
  updateExerciseValidator,
  deleteExerciseValidator,
} = require("../../utils/validators/exerciseValidator");
const {
  getExercises,
  createExercise,
  getExercise,
  updateExercise,
  deleteExercise,
  filterExercisesBasedOnGender,
  handlingVideoResponse,
  moveToRecycleBin,
  restoreFromRecycleBin,
  filterOnExercisesNotInTrash,
  filterOnExercisesInTrash,
} = require("../../services/exerciseServices");
const checkPermission = require("../../middlewares/permissionMiddleware");

const authServices = require("../../services/authServices");

// const serviceRoute = require("./serviceRoute");

const router = express.Router();

router
  .route("/")
  .get(
    // authServices.protect,
    // authServices.allowTo("user", "admin", "sub-admin"),
    // checkPermission("Exercise", "read"),
    // filterOnExercisesInTrash,
    filterExercisesBasedOnGender,
    filterOnExercisesNotInTrash,
    getExercises
  )
  .post(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Exercise", "create"),
    handlingVideoResponse,
    createExerciseValidator,
    createExercise
  );

router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin", "sub-admin"),
    checkPermission("Exercise", "read"),
    getExerciseValidator,
    getExercise
  )
  .put(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Exercise", "update"),
    handlingVideoResponse,
    updateExerciseValidator,
    updateExercise
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Exercise", "delete"),
    deleteExerciseValidator,
    deleteExercise
  );
router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Exercise", "delete"),
  // deleteLessonValidator,
  moveToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Exercise", "delete"),
  // deleteLessonValidator,
  restoreFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Exercise", "delete"),
  filterOnExercisesInTrash,
  // filterExercisesBasedOnGender,
  // filterOnExercisesNotInTrash,
  getExercises
);
module.exports = router;
