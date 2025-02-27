const express = require("express");

const {
  getVitaminValidator,
  createVitaminValidator,
  updateVitaminValidator,
  deleteVitaminValidator,
} = require("../../utils/validators/vitaminValidator");
const {
  getVitamins,
  createVitamin,
  getVitamin,
  updateVitamin,
  deleteVitamin,
  filterOnVitaminsNotInTrash,
  moveVitaminToRecycleBin,
  restoreVitaminFromRecycleBin,
  filterOnVitaminsInTrash,
  uploadVitaminImage,
  resizeImage,
} = require("../../services/vitaminService");

const authServices = require("../../services/authServices");
const checkPermission = require("../../middlewares/permissionMiddleware");

const router = express.Router();

// router.use("/:VitaminId/courses", courseRoute);

router
  .route("/")
  .get(filterOnVitaminsNotInTrash, getVitamins)
  .post(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Vitamin", "create"),
    uploadVitaminImage,
    resizeImage,
    createVitaminValidator,
    createVitamin
  );
router
  .route("/:id")
  .get(getVitaminValidator, getVitamin)
  .put(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Vitamin", "update"),
    uploadVitaminImage,
    resizeImage,
    updateVitaminValidator,
    updateVitamin
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Vitamin", "delete"),
    deleteVitaminValidator,
    deleteVitamin
  );

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Vitamin", "delete"),
  // deleteLessonValidator,
  moveVitaminToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Vitamin", "delete"),
  // deleteLessonValidator,
  restoreVitaminFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Vitamin", "delete"),
  filterOnVitaminsInTrash,
  // filterExercisesBasedOnGender,
  // filterOnExercisesNotInTrash,
  getVitamins
);
module.exports = router;
