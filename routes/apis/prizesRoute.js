const express = require("express");
const {
  resizeImage,
  uploadPrizeImage,
  createPrize,
  deletePrize,
  getAllPrizes,
  getSpecificPrize,
  updatePrize,
} = require("../../services/prizesService");
const {
  createPrizeValidator,
  deletePrizeValidator,
  getOnePrizeValidator,
  updatePrizeValidator,
} = require("../../utils/validators/prizesValidator");
const checkPermission = require("../../middlewares/permissionMiddleware");
const authServices = require("../../services/authServices");
const {
  handlingVideoResponse,
} = require("../../middlewares/handle-video-response");

const router = express.Router();

router
  .route("/")
  .get(authServices.protect, checkPermission("Prizes", "read"), getAllPrizes)
  .post(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Prizes", "create"),
    uploadPrizeImage,
    resizeImage,
    handlingVideoResponse,
    createPrizeValidator,
    createPrize
  );

router
  .route("/:id")
  .get(
    authServices.protect,
    checkPermission("Prizes", "read"),
    getOnePrizeValidator,
    getSpecificPrize
  )
  .put(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Prizes", "update"),
    uploadPrizeImage,
    resizeImage,
    handlingVideoResponse,
    updatePrizeValidator,
    updatePrize
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Prizes", "delete"),
    deletePrizeValidator,
    deletePrize
  );

module.exports = router;
