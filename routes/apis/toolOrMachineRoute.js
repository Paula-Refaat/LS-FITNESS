const express = require("express");

const {
  getDeepAnatomy,
  getDeepAnatomies,
  createDeepAnatomy,
  updateDeepAnatomy,
  // deleteCategory,
} = require("../../services/deepAnatomyService");

const authServices = require("../../services/authServices");
const {
  createDeepAnatomyValidator,
  getDeepAnatomyValidator,
  updateDeepAnatomyValidator,
} = require("../../utils/validators/deepAnatomyValidator");
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

// const serviceRoute = require("./serviceRoute");

const router = express.Router();

// router.use("/:categoryId/service", serviceRoute);

router
  .route("/")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin"),
    filterOnToolOrMachineNotInTrash,
    getToolOrMachines
  )
  .post(
    authServices.protect,
    authServices.allowTo("admin"),
    createToolOrMachineValidator,
    createToolOrMachine
  );
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin"),
    getToolOrMachineValidator,
    getToolOrMachine
  )
  .put(
    authServices.protect,
    authServices.allowTo("admin"),
    updateToolOrMachineValidator,
    updateToolOrMachine
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin"),
    deleteToolOrMachineValidator,
    deleteToolOrMachine
  );

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("admin"),
  moveToolOrMachineToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("admin"),
  restoreToolOrMachineFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("admin"),
  filterOnToolOrMachineInTrash,
  getToolOrMachines
);

module.exports = router;
