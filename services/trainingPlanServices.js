const factory = require("./handllerFactory");
const trainingPlan = require("../models/trainingPlanModel");
exports.getAllTrainingPlan = factory.getAll(trainingPlan, "trainingPlan");
exports.getOneTrainingPlan = factory.getOne(trainingPlan);
exports.createTrainingPlan = factory.createOne(trainingPlan);
exports.updateTrainingPlan = factory.updateOne(trainingPlan);
exports.deleteTrainingPlan = factory.deleteOne(trainingPlan);
