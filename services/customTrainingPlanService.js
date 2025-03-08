const fs = require("fs/promises");
const path = require("path");
const factory = require("./handllerFactory");
const { uploadSingleMedia } = require("../middlewares/uploadImageMiddleware");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const CustomTrainingPlanModel = require("../models/customTrainingPlanModel");
const TrainerProfileModel = require("../models/TrainerProfileModel");
const ApiError = require("../utils/ApiError");

// Check If can add custom training plan
exports.checkCanAddCustomTrainingPlan = asyncHandler(async (req, res, next) => {
  console.log(req.user.role);

  if (req.user.role === "user") return next();

  if (req.user.role === "trainer") {
    if (!req.body?.user) return next();

    const isUserSubscribedToTrainerPlan = await TrainerProfileModel.findOne({
      "subscribers.user": req.body.user,
      isDeleted: false,
    });

    if (!isUserSubscribedToTrainerPlan)
      return next(new ApiError("Cannot add plan for non-subscribed user", 403));

    return next();
  }

  return next(new ApiError("Cannot add plan", 403));
});

// Check If can edit custom training plan
exports.checkCanEditCustomTrainingPlan = asyncHandler(
  async (req, res, next) => {
    const trainingPlan = await CustomTrainingPlanModel.findById(req.params.id);
    if (!trainingPlan)
      return next(new ApiError("Training plan not found", 404));

    if (trainingPlan.user.toString() === req.user._id.toString()) {
      return next();
    }

    if (
      req.user.role === "trainer" &&
      trainingPlan.createdBy.toString() === req.user._id.toString()
    ) {
      const isUserSubscribedToTrainerPlan = await TrainerProfileModel.findOne({
        "subscribers.user": req.user._id,
        isDeleted: false,
      });
      if (!isUserSubscribedToTrainerPlan)
        return next(
          new ApiError("Cannot edit plan for non-subscribed user", 403)
        );

      return next();
    }

    return next(new ApiError("Cannot edit plan", 403));
  }
);

// Add filter obj to req
exports.addFilterObjToReq = asyncHandler((req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }

  if (req.user.role === "user") {
    req.filterObj["user"] = req.user._id;
  } else if (req.user.role === "trainer") {
    req.filterObj["createdBy"] = req.user._id;
  }

  next();
});

// Add creator ID in data
exports.addIDsInData = asyncHandler((req, res, next) => {
  const { _id } = req.user;

  req.body.createdBy = _id;
  req.body.user = _id;

  next();
});

exports.makeParsingToDaysAndType = asyncHandler(async (req, res, next) => {
  if (req.body.days) {
    try {
      if (typeof req.body.days === "string") {
        req.body.days = JSON.parse(req.body.days);
      } else if (Array.isArray(req.body.days)) {
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

  if (req.body.type === "exercises") {
    if (req.body.days.some((d) => !d.exercises))
      return res
        .status(400)
        .json({ mesage: "Exercises are required in all plan days" });

    req.body.days.forEach((d) => delete d?.meals);
  } else if (req.body.type === "meals") {
    if (req.body.days.some((d) => !d.meals))
      return res
        .status(400)
        .json({ mesage: "Meals are required in all plan days" });

    req.body.days.forEach((d) => delete d?.exercises);
  }

  next();
});

exports.uploadCustomTrainingPlanImage = uploadSingleMedia("image", "image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const directoryPath = "uploads/customTrainingPlan";

    await fs.mkdir(directoryPath, { recursive: true });

    const imageName = `customTrainingPlan-${uuidv4()}-${Date.now()}.webp`;
    const imagePath = path.join(directoryPath, imageName);

    await fs.writeFile(imagePath, req.file.buffer);

    const nameOfImg = imageName.split(".")[0];

    req.body.image = nameOfImg;
  }

  next();
});
exports.filterToGetCustomTrainingPlanBasedOnUserId = asyncHandler(
  async (req, res, next) => {
    // Ensure req.filterObj is initialized
    req.filterObj = req.filterObj || {};

    // Apply filter only if a trainer is requesting a specific user's plan
    if (req.params.userId && req.user.role === "trainer") {
      req.filterObj = {
        user: req.params.userId,
        createdBy: req.user.id,
      };
    }

    next();
  }
);

exports.createCustomTrainingPlan = factory.createOne(CustomTrainingPlanModel);
exports.getCustomTrainingPlan = factory.getOneWithFilterObject(
  CustomTrainingPlanModel
);
exports.updateCustomTrainingPlan = factory.updateOne(CustomTrainingPlanModel);
exports.deleteCustomTrainingPlan = factory.deleteOne(CustomTrainingPlanModel);
exports.getCustomTrainingPlans = factory.getAll(
  CustomTrainingPlanModel,
  "CustomTrainingPlan"
);
