const express = require("express");

const authServices = require("../../services/authServices");
const {
  getSocialMediaLinks,
  getSingleSocialMediaLink,
  updateSocialMediaLink,
  deleteSocialMediaLinks,
  createSocialMediaLinks,
  uploadSocialMediaImage,
  resizeImage,
} = require("../../services/SocialMediaLinksService");
const checkPermission = require("../../middlewares/permissionMiddleware");
const {
  createSocialMediaLinkValidator,
  getSocialMediaLinkValidator,
  updateSocialMediaLinkValidator,
  deleteSocialMediaLinkValidator,
} = require("../../utils/validators/socialMediaValidator");

const router = express.Router();

router
  .route("/")
  .get(
    authServices.protect,
    // authServices.allowTo("admin", "sub-admin"),
    // checkPermission("SocialMediaLinks", "read"),
    getSocialMediaLinks
  )
  .post(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("SocialMediaLinks", "read"),
    uploadSocialMediaImage,
    resizeImage,
    createSocialMediaLinkValidator,
    createSocialMediaLinks
  );
router
  .route("/:id")
  .get(
    authServices.protect,
    // authServices.allowTo("admin", "sub-admin"),
    // checkPermission("SocialMediaLinks", "read"),
    getSocialMediaLinkValidator,
    getSingleSocialMediaLink
  )
  .put(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("SocialMediaLinks", "update"),
    uploadSocialMediaImage,
    resizeImage,
    updateSocialMediaLinkValidator,
    updateSocialMediaLink
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("SocialMediaLinks", "delete"),
    deleteSocialMediaLinkValidator,
    deleteSocialMediaLinks
  );

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
