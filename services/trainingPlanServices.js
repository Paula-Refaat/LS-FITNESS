const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const factory = require("./handllerFactory");
const trainingPlan = require("../models/trainingPlanModel");
const { uploadSingleMedia } = require("../middlewares/uploadImageMiddleware");
const asyncHandler = require("express-async-handler");

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
exports.uploadTrainingPlanImg = uploadSingleMedia("image", "image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const directoryPath = "uploads/trainingPlan";
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    const imageName = `trainingPlan-${uuidv4()}-${Date.now()}.jpeg`;
    const imagePath = `${directoryPath}/${imageName}`;

    fs.writeFileSync(imagePath, req.file.buffer);

    // Save image name into the request body for further use (e.g., saving in DB)
    req.body.image = imageName;
  }
  next();
});
exports.makeParsingToDays = asyncHandler(async (req, res, next) => {
  if (req.body.days) {
    try {
      // إذا كان الحقل بالفعل Object، لا حاجة لتحويله
      if (typeof req.body.days === "string") {
        req.body.days = JSON.parse(req.body.days); // الحقل نصي ويحتاج إلى تحويل
      } else if (Array.isArray(req.body.days)) {
        // الحقل عبارة عن Array حقيقي، نقبله كما هو
        req.body.days = req.body.days;
      } else {
        return res.status(400).json({
          message:
            "Invalid days format: Expected JSON string or Array of objects",
          receivedType: typeof req.body.days,
        });
      }
    } catch (error) {
      return res.status(400).json({
        message: "Invalid JSON format in days field",
        error: error.message,
        receivedValue: req.body.days,
      });
    }
  } else {
    return res.status(400).json({ message: "Missing days field" });
  }
  next();
});

exports.getAllTrainingPlan = factory.getAll(trainingPlan, "trainingPlan");
exports.getOneTrainingPlan = factory.getOne(trainingPlan);
exports.createTrainingPlan = factory.createOne(trainingPlan);
exports.updateTrainingPlan = factory.updateOne(trainingPlan);
exports.moveTrainingPlanToRecycleBin = factory.moveToRecycleBin(trainingPlan);
exports.restoreTrainingPlanFromRecycleBin =
  factory.restoreFromRecycleBin(trainingPlan);
exports.deleteTrainingPlan = factory.deleteOne(trainingPlan);
