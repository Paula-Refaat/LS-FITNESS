const factory = require("./handllerFactory");
const trainingPlan = require("../models/trainingPlanModel");
// Filter out TrainingPlan that are not in the trash
exports.filterOnTrainingPlanNotInTrash = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }

  // شمل المستندات التي لا تحتوي على isDeleted أو التي isDeleted ليست true
  req.filterObj.$or = [
    { isDeleted: { $exists: false } }, // المستندات التي لا تحتوي على isDeleted
    { isDeleted: false }, // المستندات التي isDeleted = false
  ];

  next();
};

// Filter out TrainingPlan that are in the trash
exports.filterOnTrainingPlanInTrash = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }

  req.filterObj.isDeleted = true;

  next();
};
exports.getAllTrainingPlan = factory.getAll(trainingPlan, "trainingPlan");
exports.getOneTrainingPlan = factory.getOne(trainingPlan);
exports.createTrainingPlan = factory.createOne(trainingPlan);
exports.updateTrainingPlan = factory.updateOne(trainingPlan);
exports.moveTrainingPlanToRecycleBin = factory.moveToRecycleBin(trainingPlan);
exports.restoreTrainingPlanFromRecycleBin =
  factory.restoreFromRecycleBin(trainingPlan);
exports.deleteTrainingPlan = factory.deleteOne(trainingPlan);
