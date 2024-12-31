const express = require("express");

const {
  getBodyPartValidator,
  createBodyPartValidator,
  updateBodyPartValidator,
  deleteBodyPartValidator,
} = require("../../utils/validators/bodyPartValidator");
const {
  getBodyParts,
  createBodyPart,
  getBodyPart,
  updateBodyPart,
  deleteBodyPart,
  filterOnBodyPartsNotInTrash,
  moveBodyPartToRecycleBin,
  restoreBodyPartFromRecycleBin,
  filterOnBodyPartsInTrash,
} = require("../../services/bodyPartServices");

const authServices = require("../../services/authServices");
const {
  getDeepAnatomiesFromExerciseByBodyPart,
} = require("../../services/bodyPartServices");
const checkPermission = require("../../middlewares/permissionMiddleware");

// const serviceRoute = require("./serviceRoute");

const router = express.Router();

// router.use("/:BodyPartId/service", serviceRoute);

router
  .route("/")
  .get(
    // authServices.protect,
    // authServices.allowTo("user", "admin"),
    filterOnBodyPartsNotInTrash,
    getBodyParts
  )
  .post(
    authServices.protect,
    authServices.allowTo("sub-admin", "admin"),
    checkPermission("BodyPart", "create"),
    createBodyPartValidator,
    createBodyPart
  );
router
  .route("/:id")
  .get(
    // authServices.protect,
    // authServices.allowTo("user", "admin"),
    getBodyPartValidator,
    getBodyPart
  )
  .put(
    authServices.protect,
    authServices.allowTo("sub-admin", "admin"),
    checkPermission("BodyPart", "update"),
    updateBodyPartValidator,
    updateBodyPart
  )
  .delete(
    authServices.protect,
    authServices.allowTo("sub-admin", "admin"),
    checkPermission("BodyPart", "delete"),
    deleteBodyPartValidator,
    deleteBodyPart
  );
router.get(
  "/:bodyPartId/deepAnatomies",
  getDeepAnatomiesFromExerciseByBodyPart
);

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("BodyPart", "delete"),
  // deleteLessonValidator,
  moveBodyPartToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("BodyPart", "delete"),
  // deleteLessonValidator,
  restoreBodyPartFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("BodyPart", "delete"),
  filterOnBodyPartsInTrash,
  // filterExercisesBasedOnGender,
  // filterOnExercisesNotInTrash,
  getBodyParts
);
module.exports = router;
