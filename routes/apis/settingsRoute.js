const express = require("express");

const authServices = require("../../services/authServices");
const {
  getSettings,
  createSettings,
  getSingleSettings,
  updateSettings,
} = require("../../services/settingsService");

const router = express.Router();

router
  .route("/")
  .get(authServices.protect, authServices.allowTo("admin"), getSettings)
//   .post(authServices.protect, authServices.allowTo("admin"), createSettings);
router
  .route("/:id")
  .get(authServices.protect, authServices.allowTo("admin"), getSingleSettings)
  .put(authServices.protect, authServices.allowTo("admin"), updateSettings);
//   .delete(
//     authServices.protect,
//     authServices.allowTo("admin"),
//     deleteCategoryValidator,
//     deleteCategory
//   );

// router.delete(
//   "/:id/moveToTrash",
//   authServices.protect,
//   authServices.allowTo("admin"),
//   // deleteLessonValidator,
//   moveCategoryToRecycleBin
// );
// router.put(
//   "/:id/restore",
//   authServices.protect,
//   authServices.allowTo("admin"),
//   // deleteLessonValidator,
//   restoreCategoryFromRecycleBin
// );
// router.get(
//   "/deleted/trash",
//   authServices.protect,
//   authServices.allowTo("admin"),
//   filterOnCategoriesInTrash,
//   // filterExercisesBasedOnGender,
//   // filterOnExercisesNotInTrash,
//   getCategories
// );
module.exports = router;
