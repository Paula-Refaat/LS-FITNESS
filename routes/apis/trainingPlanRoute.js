const express = require("express");

const router = express.Router();

const authServices = require("../../services/authServices");
const {
  createTrainingPlan,
  getOneTrainingPlan,
  updateTrainingPlan,
  deleteTrainingPlan,
  getAllTrainingPlan,
} = require("../../services/trainingPlanServices");

router.get(
  "/",
  authServices.protect,
  authServices.allowTo("admin"),
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
  createTrainingPlan
);
router.put(
  "/:id",
  authServices.protect,
  authServices.allowTo("admin"),
  updateTrainingPlan
);
router.delete(
  "/:id",
  authServices.protect,
  authServices.allowTo("admin"),
  deleteTrainingPlan
);
module.exports = router;
