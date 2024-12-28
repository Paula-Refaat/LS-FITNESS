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
} = require("../../services/trainingPlanServices");

router.get(
  "/",
  authServices.protect,
  authServices.allowTo("admin"),
  filterOnTrainingPlanNotInTrash,
  getAllTrainingPlan
);
router.get(
  "/:id",
  authServices.protect,
  authServices.allowTo("admin"),
  getOneTrainingPlan
);
router.post(
  "/",
  authServices.protect,
  authServices.allowTo("admin"),
  uploadTrainingPlanImg,
  resizeImage,
  createTrainingPlan
);
router.put(
  "/:id",
  authServices.protect,
  authServices.allowTo("admin"),
  uploadTrainingPlanImg,
  resizeImage,
  updateTrainingPlan
);
router.delete(
  "/:id",
  authServices.protect,
  authServices.allowTo("admin"),
  deleteTrainingPlan
);
router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("admin"),
  moveTrainingPlanToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("admin"),
  restoreTrainingPlanFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("admin"),
  filterOnTrainingPlanInTrash,
  getAllTrainingPlan
);
module.exports = router;
