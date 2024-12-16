const path = require("path");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const TrainerRequest = require("../models/trainerRequestModel");
const factory = require("./handllerFactory");
const { uploadMixOfMedia } = require("../middlewares/uploadImageMiddleware");

// إعداد رفع الملفات
exports.uploadinfo = uploadMixOfMedia(
  [
    {
      name: "certificates",
      maxCount: 10,
    },
  ],
  "image"
);

// معالجة الملفات
exports.handleMarketingReqsPdfs = asyncHandler(async (req, res, next) => {
  if (req.files && req.files.certificates) {
    const certificatesDir = "uploads/trainerRequests/Certificates";

    // إنشاء المجلد إذا لم يكن موجودًا
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }

    // معالجة جميع ملفات الشهادات
    req.body.certificates = [];
    for (const certificateFile of req.files.certificates) {
      const certificateName = `trainerRequests-certificate-${uuidv4()}-${Date.now()}.jpeg`;
      const certificatePath = `${certificatesDir}/${certificateName}`;

      // حفظ الملف
      fs.writeFileSync(certificatePath, certificateFile.buffer);

      // إضافة اسم الملف إلى المصفوفة
      req.body.certificates.push(certificateName);
    }
  }

  next();
});

//@desc request to ba a Trainer
//@route POST /api/v1/TrainerRequests
//@access public
exports.requestToBeTrainer = asyncHandler(async (req, res, next) => {
  const {
    name,
    email,
    phone,
    location,
    age,
    yearsOfExperience,
    nationality,
    numberOfTrainees,
    introduceYourSelf,
    certificates,
  } = req.body;

  try {
    // Create a new LawyerRequest document
    const trainerRequest = await TrainerRequest.create({
      name,
      email,
      phone,
      location,
      age,
      yearsOfExperience,
      nationality,
      numberOfTrainees,
      introduceYourSelf,
      certificates,
      user: req.user._id,
    });

    // Respond with the created trainerRequest
    res.status(201).json({ data: trainerRequest });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
});

//@desc get list of TrainerRequest
//@route GET /api/v1/TrainerRequests
//@access protected
exports.getTrainerRequests = factory.getAll(TrainerRequest, "TrainerRequest");

//@desc get specific TrainerRequest by id
//@route GET /api/v1/TrainerRequests/:id
//@access protected
exports.getTrainerRequest = factory.getOne(TrainerRequest);

//@desc delete TrainerRequest
//@route DELETE /api/v1/TrainerRequests/:id
//@access protected
exports.deleteTrainerRequest = factory.deleteOne(TrainerRequest);

//@desc Update TrainerRequest
//@route POST /api/v1/TrainerRequests/:id
//@access Private
exports.updateTrainerRequest = asyncHandler(async (req, res, next) => {
  try {
    const existingTrainerRequest = await TrainerRequest.findById(req.params.id);
    if (!existingTrainerRequest) {
      return res.status(404).json({ message: "Trainer request not found" });
    }
    const updatedTrainerRequest = await TrainerRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ data: updatedTrainerRequest });
  } catch (error) {
    next(error);
  }
});
