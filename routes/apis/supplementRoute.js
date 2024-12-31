const express = require("express");

const {
  getSupplementValidator,
  createSupplementValidator,
  updateSupplementValidator,
  deleteSupplementValidator,
} = require("../../utils/validators/supplementValidator");
const {
  getSupplements,
  createSupplement,
  getSupplement,
  updateSupplement,
  deleteSupplement,
  filterOnSupplementsNotInTrash,
  moveSupplementToRecycleBin,
  restoreSupplementFromRecycleBin,
  filterOnSupplementsInTrash,
  uploadSupplementImage,
  resizeImage,
  handlingVideoResponse,
} = require("../../services/supplementServices");

const authServices = require("../../services/authServices");
const checkPermission = require("../../middlewares/permissionMiddleware");

const router = express.Router();

// router.use("/:SupplementId/courses", courseRoute);

router
  .route("/")
  .get(filterOnSupplementsNotInTrash, getSupplements)
  .post(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Supplement", "create"),
    uploadSupplementImage,
    resizeImage,
    handlingVideoResponse,
    createSupplementValidator,
    createSupplement
  );
router
  .route("/:id")
  .get(getSupplementValidator, getSupplement)
  .put(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Supplement", "update"),
    uploadSupplementImage,
    resizeImage,
    handlingVideoResponse,
    updateSupplementValidator,
    updateSupplement
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Supplement", "delete"),
    deleteSupplementValidator,
    deleteSupplement
  );

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Supplement", "delete"),
  // deleteLessonValidator,
  moveSupplementToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Supplement", "delete"),
  // deleteLessonValidator,
  restoreSupplementFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Supplement", "delete"),
  filterOnSupplementsInTrash,
  // filterExercisesBasedOnGender,
  // filterOnExercisesNotInTrash,
  getSupplements
);
module.exports = router;
