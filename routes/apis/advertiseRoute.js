const express = require("express");

const authServices = require("../../services/authServices");
const {
  createAdvertise,
  getAllAdvertises,
  uploadAdvertiseImage,
  getOneAdvertise,
  updateAdvertise,
  deleteAdvertise,
  resizeImage,
} = require("../../services/advertiseService");
const checkPermission = require("../../middlewares/permissionMiddleware");

const router = express.Router();

// router.use("/:VitaminId/courses", courseRoute);

router
  .route("/")
  .get(getAllAdvertises)
  .post(
    authServices.protect,
    authServices.allowTo("sub-admin", "admin"),
    checkPermission("Advertise", "create"),
    uploadAdvertiseImage,
    resizeImage,
    createAdvertise
  );
router
  .route("/:id")
  .get(getOneAdvertise)
  .put(
    authServices.protect,
    authServices.allowTo("sub-admin", "admin"),
    checkPermission("Advertise", "update"),
    uploadAdvertiseImage,
    resizeImage,
    updateAdvertise
  )
  .delete(
    authServices.protect,
    authServices.allowTo("sub-admin", "admin"),
    checkPermission("Advertise", "delete"),
    deleteAdvertise
  );

// router.delete(
//   "/:id/moveToTrash",
//   authServices.protect,
//   authServices.allowTo("admin"),
//   // deleteLessonValidator,
//   moveVitaminToRecycleBin
// );
// router.put(
//   "/:id/restore",
//   authServices.protect,
//   authServices.allowTo("admin"),
//   // deleteLessonValidator,
//   restoreVitaminFromRecycleBin
// );
// router.get(
//   "/deleted/trash",
//   authServices.protect,
//   authServices.allowTo("admin"),
//   filterOnVitaminsInTrash,
//   // filterExercisesBasedOnGender,
//   // filterOnExercisesNotInTrash,
//   getVitamins
// );
module.exports = router;
