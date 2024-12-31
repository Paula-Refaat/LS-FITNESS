const express = require("express");

const authServices = require("../../services/authServices");

const {
  getToolOrMachines,
  createToolOrMachine,
  getToolOrMachine,
  updateToolOrMachine,
  deleteToolOrMachine,
  moveToolOrMachineToRecycleBin,
  restoreToolOrMachineFromRecycleBin,
  filterOnToolOrMachineInTrash,
  filterOnToolOrMachineNotInTrash,
} = require("../../services/toolOrMachineService");
const {
  createToolOrMachineValidator,
  getToolOrMachineValidator,
  updateToolOrMachineValidator,
  deleteToolOrMachineValidator,
} = require("../../utils/validators/toolOrMachineValidator");
const checkPermission = require("../../middlewares/permissionMiddleware");

// const serviceRoute = require("./serviceRoute");

const router = express.Router();

// router.use("/:categoryId/service", serviceRoute);

router
  .route("/")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin", "sub-admin"),
    checkPermission("ToolOrMachine", "read"),
    filterOnToolOrMachineNotInTrash,
    getToolOrMachines
  )
  .post(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("ToolOrMachine", "create"),
    createToolOrMachineValidator,
    createToolOrMachine
  );
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin", "sub-admin"),
    checkPermission("ToolOrMachine", "read"),
    getToolOrMachineValidator,
    getToolOrMachine
  )
  .put(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("ToolOrMachine", "update"),
    updateToolOrMachineValidator,
    updateToolOrMachine
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("ToolOrMachine", "delete"),
    deleteToolOrMachineValidator,
    deleteToolOrMachine
  );

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("ToolOrMachine", "delete"),
  moveToolOrMachineToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("ToolOrMachine", "delete"),
  restoreToolOrMachineFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("ToolOrMachine", "delete"),
  filterOnToolOrMachineInTrash,
  getToolOrMachines
);

module.exports = router;
