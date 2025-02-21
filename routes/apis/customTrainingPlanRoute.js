const express = require("express");

const authServices = require("../../services/authServices");
const {
  createCustomTrainingPlan,
  getCustomTrainingPlan,
  updateCustomTrainingPlan,
  deleteCustomTrainingPlan,
  getCustomTrainingPlans,
  checkCanAddCustomTrainingPlan,
  checkCanEditCustomTrainingPlan,
  addFilterObjToReq,
  addIDsInData,
  uploadCustomTrainingPlanImage,
  resizeImage,
  makeParsingToDaysAndType,
} = require("../../services/customTrainingPlanService");

const {
  createCustomTrainingPlanValidator,
  getCustomTrainingPlanValidator,
  updateCustomTrainingPlanValidator,
  deleteCustomTrainingPlanValidator,
} = require("../../utils/validators/customTrainingPlanValidator");
const checkPermission = require("../../middlewares/permissionMiddleware");

const router = express.Router();

router
  .route("/")
  .get(
    authServices.protect,
    checkPermission("CustomTrainingPlan", "read"),
    addFilterObjToReq,
    getCustomTrainingPlans
  )
  .post(
    authServices.protect,
    checkPermission("CustomTrainingPlan", "create"),
    uploadCustomTrainingPlanImage,
    resizeImage,
    createCustomTrainingPlanValidator,
    makeParsingToDaysAndType,
    checkCanAddCustomTrainingPlan,
    addIDsInData,
    createCustomTrainingPlan
  );

router
  .route("/:id")
  .get(
    authServices.protect,
    checkPermission("CustomTrainingPlan", "read"),
    getCustomTrainingPlanValidator,
    addFilterObjToReq,
    getCustomTrainingPlan
  )
  .put(
    authServices.protect,
    checkPermission("CustomTrainingPlan", "update"),
    uploadCustomTrainingPlanImage,
    resizeImage,
    updateCustomTrainingPlanValidator,
    makeParsingToDaysAndType,
    checkCanEditCustomTrainingPlan,
    updateCustomTrainingPlan
  )
  .delete(
    authServices.protect,
    checkPermission("CustomTrainingPlan", "delete"),
    deleteCustomTrainingPlanValidator,
    checkCanEditCustomTrainingPlan,
    deleteCustomTrainingPlan
  );

module.exports = router;
