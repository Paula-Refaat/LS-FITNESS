const express = require("express");

const {
  createPermission,
  getOnePermission,
  updatePermission,
  getAllPermission,
  createFilterObj,
} = require("../../services/permissionService");
const {
  createPermissionValidator,
} = require("../../utils/validators/permissionValidator");

const authServices = require("../../services/authServices");
const checkPermission = require("../../middlewares/permissionMiddleware");

const router = express.Router();
router
  .route("/:userId")
  .post(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Permission", "read"),
    createPermissionValidator,
    createPermission
  );
router.get(
  "/:id",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Permission", "read"),
  getOnePermission
);
router.get(
  "/",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Permission", "read"),
  getAllPermission
);
router.put(
  "/:id",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Permission", "read"),
  updatePermission
);
// Get All Permissions Based On User ID
router.get(
  "/:userId/permissions",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Permission", "read"),
  createFilterObj,
  getAllPermission,
);
module.exports = router;
