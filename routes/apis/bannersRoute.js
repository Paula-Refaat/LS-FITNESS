const express = require("express");
const {
  resizeImage,
  uploadBannerImage,
  createBanner,
  deleteBanner,
  getAllBanners,
  getSpecificBanner,
  updateBanner,
  filterBannersBasedOnGender,
} = require("../../services/bannersService");
const {
  createBannerValidator,
  deleteBannerValidator,
  getOneBannerValidator,
  updateBannerValidator,
} = require("../../utils/validators/bannersValidator");
const checkPermission = require("../../middlewares/permissionMiddleware");
const authServices = require("../../services/authServices");
const {
  handlingVideoResponse,
} = require("../../middlewares/handle-video-response");

const router = express.Router();

router
  .route("/")
  .get(filterBannersBasedOnGender, getAllBanners)
  .post(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Banners", "create"),
    uploadBannerImage,
    resizeImage,
    handlingVideoResponse,
    createBannerValidator,
    createBanner
  );

router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin", "sub-admin"),
    checkPermission("Banners", "read"),
    getOneBannerValidator,
    getSpecificBanner
  )
  .put(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Banners", "update"),
    uploadBannerImage,
    resizeImage,
    handlingVideoResponse,
    updateBannerValidator,
    updateBanner
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Banners", "delete"),
    deleteBannerValidator,
    deleteBanner
  );

module.exports = router;
