const express = require("express");
const {
  uploadWinnerImage,
  createWinner,
  deleteWinner,
  getAllWinners,
  getSpecificWinner,
  updateWinner,
  resizeWinnerImage,
} = require("../../services/winnersService");
const {
  createWinnerValidator,
  deleteWinnerValidator,
  getOneWinnerValidator,
  updateWinnerValidator,
} = require("../../utils/validators/winnersValidator");
const checkPermission = require("../../middlewares/permissionMiddleware");
const authServices = require("../../services/authServices");
const {
  handleImageMiddleware,
} = require("../../middlewares/handleImageFieldsMiddleware");

const router = express.Router();

router
  .route("/")
  .get(authServices.protect, checkPermission("Winners", "read"), getAllWinners)
  .post(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Winners", "create"),
    uploadWinnerImage,
    resizeWinnerImage,
    createWinnerValidator,
    createWinner
  );

router
  .route("/:id")
  .get(
    authServices.protect,
    checkPermission("Winners", "read"),
    getOneWinnerValidator,
    getSpecificWinner
  )
  .put(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Winners", "update"),
    uploadWinnerImage,
    handleImageMiddleware,
    resizeWinnerImage,
    updateWinnerValidator,
    updateWinner
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Winners", "delete"),
    deleteWinnerValidator,
    deleteWinner
  );

module.exports = router;
