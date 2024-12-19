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

const router = express.Router();

// router.use("/:SupplementId/courses", courseRoute);

router
  .route("/")
  .get(filterOnSupplementsNotInTrash, getSupplements)
  .post(
    authServices.protect,
    authServices.allowTo("admin"),
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
    authServices.allowTo("admin"),
    uploadSupplementImage,
    resizeImage,
    handlingVideoResponse,
    updateSupplementValidator,
    updateSupplement
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin"),
    deleteSupplementValidator,
    deleteSupplement
  );

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("admin"),
  // deleteLessonValidator,
  moveSupplementToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("admin"),
  // deleteLessonValidator,
  restoreSupplementFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("admin"),
  filterOnSupplementsInTrash,
  // filterExercisesBasedOnGender,
  // filterOnExercisesNotInTrash,
  getSupplements
);
module.exports = router;
