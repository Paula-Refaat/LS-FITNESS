const express = require("express");

const { createPermission } = require("../../services/permissionService");
const {
  createPermissionValidator,
} = require("../../utils/validators/permissionValidator");

const authServices = require("../../services/authServices");
const checkPermission = require("../../middlewares/permissionMiddleware");

const router = express.Router();
router
  .route("/:userId")
  //   .get(
  //     authServices.protect,
  //     authServices.allowTo("admin", "sub-admin"),
  //     createPermissionValidator,
  //     createPermission
  //   )
  .post(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Permission", "read"),
    createPermissionValidator,
    createPermission
  );
module.exports = router;
