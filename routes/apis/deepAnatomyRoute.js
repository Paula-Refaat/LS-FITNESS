const express = require("express");

const {
  getDeepAnatomy,
  getDeepAnatomies,
  createDeepAnatomy,
  updateDeepAnatomy,
  deleteDeepAnatomy,
  moveDeepAnatomyToRecycleBin,
  restoreDeepAnatomyFromRecycleBin,
  filterOnDeepAnatomyInTrash,
  // deleteCategory,
} = require("../../services/deepAnatomyService");

const authServices = require("../../services/authServices");
const {
  createDeepAnatomyValidator,
  getDeepAnatomyValidator,
  updateDeepAnatomyValidator,
  deleteDeepAnatomyValidator,
} = require("../../utils/validators/deepAnatomyValidator");
const checkPermission = require("../../middlewares/permissionMiddleware");

// const serviceRoute = require("./serviceRoute");

const router = express.Router();

// router.use("/:categoryId/service", serviceRoute);

router
  .route("/")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin", "sub-admin"),
    checkPermission("DeepAnatomy", "read"),
    getDeepAnatomies
  )
  .post(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("DeepAnatomy", "create"),
    createDeepAnatomyValidator,
    createDeepAnatomy
  );
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin", "sub-admin"),
    checkPermission("DeepAnatomy", "read"),
    getDeepAnatomyValidator,
    getDeepAnatomy
  )
  .put(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("DeepAnatomy", "update"),
    updateDeepAnatomyValidator,
    updateDeepAnatomy
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("DeepAnatomy", "delete"),
    deleteDeepAnatomyValidator,
    deleteDeepAnatomy
  );

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("DeepAnatomy", "delete"),
  moveDeepAnatomyToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("DeepAnatomy", "delete"),
  restoreDeepAnatomyFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("DeepAnatomy", "delete"),
  filterOnDeepAnatomyInTrash,
  getDeepAnatomies
);

module.exports = router;
