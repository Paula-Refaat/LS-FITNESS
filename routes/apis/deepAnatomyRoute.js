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

// const serviceRoute = require("./serviceRoute");

const router = express.Router();

// router.use("/:categoryId/service", serviceRoute);

router
  .route("/")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin"),
    getDeepAnatomies
  )
  .post(
    authServices.protect,
    authServices.allowTo("admin"),
    createDeepAnatomyValidator,
    createDeepAnatomy
  );
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin"),
    getDeepAnatomyValidator,
    getDeepAnatomy
  )
  .put(
    authServices.protect,
    authServices.allowTo("admin"),
    updateDeepAnatomyValidator,
    updateDeepAnatomy
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin"),
    deleteDeepAnatomyValidator,
    deleteDeepAnatomy
  );

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("admin"),
  moveDeepAnatomyToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("admin"),
  restoreDeepAnatomyFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("admin"),
  filterOnDeepAnatomyInTrash,
  getDeepAnatomies
);

module.exports = router;
