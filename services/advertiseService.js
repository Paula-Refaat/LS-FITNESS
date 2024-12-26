const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const Advertise = require("../models/advertiseModel"); // استيراد الموديل
const factory = require("./handllerFactory"); // استيراد الدالة
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const { uploadSingleMedia } = require("../middlewares/uploadImageMiddleware");

//upload Single image
exports.uploadAdvertiseImage = uploadSingleMedia("image", "image");

//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const directoryPath = "uploads/advertises";
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    const imageName = `advertise-${uuidv4()}-${Date.now()}.jpeg`;
    const imagePath = `uploads/advertises/${imageName}`;

    fs.writeFileSync(imagePath, req.file.buffer);

    //Save image into our db
    req.body.image = imageName;
  }
  next();
});

exports.createAdvertise = asyncHandler(async (req, res, next) => {
  const { title, image, targetModel, targetModelId } = req.body;

  // تحقق من وجود targetModel و targetModelId
  if (!targetModel || !targetModelId) {
    return res.status(400).json({
      status: "error",
      message: "Target model and ID are required",
    });
  }
  // تحقق إذا كان targetModel موجودًا في قائمة المودلز المعرفة
  const validModels = mongoose.modelNames();
  if (!validModels.includes(targetModel)) {
    return res.status(400).json({
      status: "error",
      message: `Invalid targetModel: ${targetModel}`,
    });
  }

  // البحث عن الـ targetModelId في الموديل المناسب
  const TargetModel = mongoose.model(targetModel);
  const targetDoc = await TargetModel.findById(targetModelId);

  if (!targetDoc) {
    return res.status(404).json({
      status: "error",
      message: `No document found with ID: ${targetModelId} in model: ${targetModel}`,
    });
  }

  // إنشاء الإعلان بعد التحقق
  const newAdvertise = await Advertise.create({
    title,
    image,
    targetModel: targetModel,
    targetModelId: targetModelId,
  });

  res.status(201).json({
    status: "success",
    data: newAdvertise,
  });
});

exports.getAllAdvertises = factory.getAll(
  Advertise,
  "Advertise"
  //   "targetModelId"
);

exports.getOneAdvertise = factory.getOne(Advertise);
exports.updateAdvertise = factory.updateOne(Advertise);
exports.deleteAdvertise = factory.deleteOne(Advertise);
