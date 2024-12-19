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
  handlingVideoResponse,
} = require("../../services/vitaminService");

const authServices = require("../../services/authServices");

const router = express.Router();

// router.use("/:VitaminId/courses", courseRoute);

router
  .route("/")
  .get(filterOnVitaminsNotInTrash, getVitamins)
  .post(
    authServices.protect,
    authServices.allowTo("admin"),
    uploadVitaminImage,
    resizeImage,
    handlingVideoResponse,
    createVitaminValidator,
    createVitamin
  );
router
  .route("/:id")
  .get(getVitaminValidator, getVitamin)
  .put(
    authServices.protect,
    authServices.allowTo("admin"),
    uploadVitaminImage,
    resizeImage,
    handlingVideoResponse,
    updateVitaminValidator,
    updateVitamin
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin"),
    deleteVitaminValidator,
    deleteVitamin
  );

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("admin"),
  // deleteLessonValidator,
  moveVitaminToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("admin"),
  // deleteLessonValidator,
  restoreVitaminFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("admin"),
  filterOnVitaminsInTrash,
  // filterExercisesBasedOnGender,
  // filterOnExercisesNotInTrash,
  getVitamins
);
module.exports = router;
