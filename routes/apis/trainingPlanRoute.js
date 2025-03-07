const express = require("express");

const router = express.Router();

const authServices = require("../../services/authServices");
const {
  createTrainingPlan,
  getOneTrainingPlan,
  updateTrainingPlan,
  deleteTrainingPlan,
  getAllTrainingPlan,
  moveTrainingPlanToRecycleBin,
  restoreTrainingPlanFromRecycleBin,
  filterOnTrainingPlanInTrash,
  filterOnTrainingPlanNotInTrash,
  uploadTrainingPlanImg,
  resizeImage,
  makeParsingToDays,
  filterTrainingPlansBasedOnGender,
} = require("../../services/trainingPlanServices");
const checkPermission = require("../../middlewares/permissionMiddleware");
const {
  handleImageMiddleware,
} = require("../../middlewares/handleImageFieldsMiddleware");
router.get(
  "/",
  authServices.protect,
  checkPermission("TrainingPlan", "read"),
  filterTrainingPlansBasedOnGender,
  filterOnTrainingPlanNotInTrash,
  getAllTrainingPlan
);

router.get(
  "/:id",
  authServices.protect,
  checkPermission("TrainingPlan", "read"),
  getOneTrainingPlan
);

router.post(
  "/",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("TrainingPlan", "create"),
  uploadTrainingPlanImg,
  resizeImage,
  makeParsingToDays,
  createTrainingPlan
);

router.put(
  "/:id",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("TrainingPlan", "update"),
  uploadTrainingPlanImg,
  handleImageMiddleware,
  resizeImage,
  makeParsingToDays,
  updateTrainingPlan
);

router.delete(
  "/:id",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("TrainingPlan", "delete"),
  deleteTrainingPlan
);

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("TrainingPlan", "delete"),
  moveTrainingPlanToRecycleBin
);

router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("TrainingPlan", "delete"),
  restoreTrainingPlanFromRecycleBin
);

router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("TrainingPlan", "delete"),
  filterOnTrainingPlanInTrash,
  getAllTrainingPlan
);

module.exports = router;
