const path = require("path");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const TrainerRequest = require("../models/trainerRequestModel");
const factory = require("./handllerFactory");
const { uploadMixOfMedia } = require("../middlewares/uploadImageMiddleware");

const ApiError = require("../utils/ApiError");

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.user.role === "user" || req.user.role === "trainer")
    filterObject = { user: req.user.id };
  req.filterObj = filterObject;
  next();
};
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
    const isExistsTrainerRequest = await TrainerRequest.findOne({
      user: req.user.id,
      status: "pending" || "approved",
    });
    if (isExistsTrainerRequest) {
      return res.status(400).json({
        status: "error",
        message: "You have already requested to be a trainer",
      });
    }
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

//@desc Accept TrainerRequest
//@route PUT /api/v1/TrainerRequests/:id/accept
//@access Private/Admin
exports.acceptTrainerRequest = asyncHandler(async (req, res, next) => {
  const trainerRequest = await TrainerRequest.findById(req.params.id);
  if (!trainerRequest) {
    return next(new ApiError("trainer not found", 404));
  }
  if (trainerRequest && trainerRequest.status === "approved") {
    return next(new ApiError("this trainer is already approved", 400));
  }
  await TrainerRequest.updateOne(
    { _id: req.params.id },
    {
      status: "approved",
      note: req.body.note ? req.body.note : null,
    }
  );
  res.status(200).json({
    status: "success",
    message: "trainer request accepted successfully",
    trainerNote: req.body.note ? req.body.note : null,
  });
});

//@desc Reject TrainerRequest
//@route PUT /api/v1/TrainerRequests/:id/accept
//@access Private/Admin
exports.rejectTrainerRequest = asyncHandler(async (req, res, next) => {
  const { reasonOfRejection } = req.body;
  const trainerRequest = await TrainerRequest.findById(req.params.id);
  if (!trainerRequest) {
    return next(new ApiError("trainer not found", 404));
  }
  if (trainerRequest && trainerRequest.status === "rejected") {
    return next(new ApiError("this trainer is already rejected", 400));
  }
  if (!reasonOfRejection) {
    return next(new ApiError("reason of rejection is required", 400));
  }
  await TrainerRequest.updateOne(
    { _id: req.params.id },
    {
      status: "rejected",
      reasonOfRejection: reasonOfRejection,
    }
  );
  res.status(200).json({
    status: "success",
    message: "trainer request rejected successfully",
    "reason of rejection": reasonOfRejection,
  });
});
