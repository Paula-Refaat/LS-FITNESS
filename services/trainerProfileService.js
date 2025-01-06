const path = require("path");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
// const TrainerProfile = require("../models/trainerProfileModel");
const factory = require("./handllerFactory");
const { uploadMixOfMedia } = require("../middlewares/uploadImageMiddleware");
const Notification = require("../models/notificationModel");
const ApiError = require("../utils/ApiError");
const TrainerProfile = require("../models/TrainerProfileModel");

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
    const certificatesDir = "uploads/trainerProfile/Certificates";

    // إنشاء المجلد إذا لم يكن موجودًا
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }

    // معالجة جميع ملفات الشهادات
    req.body.certificates = [];
    for (const certificateFile of req.files.certificates) {
      const certificateName = `trainerProfile-certificate-${uuidv4()}-${Date.now()}.jpeg`;
      const certificatePath = `${certificatesDir}/${certificateName}`;

      // حفظ الملف
      fs.writeFileSync(certificatePath, certificateFile.buffer);

      // إضافة اسم الملف إلى المصفوفة
      req.body.certificates.push(certificateName);
    }
  }

  next();
});

// Filter out TrainerProfile that are not in the trash
exports.filterOnTrainerProfilesNotInTrash = (req, res, next) => {
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

// Filter out TrainerProfile that are in the trash
exports.filterOnTrainerProfilesInTrash = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }

  req.filterObj.isDeleted = true;

  next();
};

// Create Trainer Profile
exports.createTrainerProfile = factory.createOne(TrainerProfile);

// Get Specific Trainer Profile
exports.getTrainerProfile = factory.getOne(TrainerProfile);

// Get All Trainer Profile
exports.getAllTrainerProfile = factory.getAll(TrainerProfile, "TrainerProfile");

// Update Specific Trainer Profile
exports.updateTrainerProfile = factory.updateOne(TrainerProfile);

exports.moveTrainerProfileToRecycleBin =
  factory.moveToRecycleBin(TrainerProfile);
exports.restoreTrainerProfileFromRecycleBin =
  factory.restoreFromRecycleBin(TrainerProfile);

// Delete Specific Trainer Profile
exports.deleteTrainerProfile = factory.deleteOne(TrainerProfile);

// Get My Trainer Profile
exports.getMyTrainerProfile = asyncHandler(async (req, res, next) => {
  const trainerProfile = await TrainerProfile.findOne({
    user: req.user._id,
  });

  if (!trainerProfile) {
    next(new ApiError("Trainer profile not found", 404));
  }

  res.status(200).json({ data: trainerProfile });
});

// Update My Trainer Profile
exports.updateMyTrainerProfile = asyncHandler(async (req, res, next) => {
  const trainerProfile = await TrainerProfile.findOneAndUpdate(
    { user: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!trainerProfile) {
    next(new ApiError("Trainer profile not found", 404));
  }

  res.status(200).json({ data: trainerProfile });
});

// Lock My Trainer Profile
exports.lockMyTrainerProfile = asyncHandler(async (req, res, next) => {
  const trainerProfile = await TrainerProfile.findOneAndUpdate(
    { user: req.user.id },
    { isLocked: true },
    { new: true, runValidators: true }
  );

  if (!trainerProfile) {
    next(new ApiError("Trainer profile not found", 404));
  }

  res
    .status(200)
    .json({ message: "Your Profile Locked Success", data: trainerProfile });
});

// UnLock My Trainer Profile
exports.unlockMyTrainerProfile = asyncHandler(async (req, res, next) => {
  const trainerProfile = await TrainerProfile.findOneAndUpdate(
    { user: req.user.id },
    { isLocked: false },
    { new: true, runValidators: true }
  );

  if (!trainerProfile) {
    next(new ApiError("Trainer profile not found", 404));
  }

  res
    .status(200)
    .json({ message: "Your Profile unLocked Success", data: trainerProfile });
});

//@desc Add Plan to Trainer Profile
//@route POST /api/v1/trainers/addPlanToMyTrainerProfile
//@access Private
exports.addTrainerPlan = async (req, res, next) => {
  try {
    const { name, type, price, description } = req.body;
    const user = req.user.id;

    // ✅ التحقق من صحة المدخلات
    if (!name || !type || !price || !description) {
      return next(new ApiError("All fields are required", 400));
    }

    // ✅ البحث عن ملف المدرب والتحقق من وجوده
    const profile = await TrainerProfile.findOne({ user: user });
    if (!profile) {
      return next(new ApiError("Trainer profile not found", 404));
    }

    // ✅ إضافة الخطة باستخدام findOneAndUpdate
    const updatedProfile = await TrainerProfile.findOneAndUpdate(
      { user: user },
      {
        $push: {
          plans: {
            name,
            type,
            price,
            description,
          },
        },
      },
      { new: true, projection: { plans: { $slice: -1 } } } // جلب آخر خطة مضافة فقط
    );

    if (!updatedProfile) {
      return next(new ApiError("Trainer profile not found", 404));
    }

    // ✅ إرسال الخطة المضافة فقط
    res.status(201).json({
      message: "Plan added successfully",
      plan: updatedProfile.plans[0], // إرجاع آخر خطة مضافة فقط
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMyTrainerPlan = async (req, res, next) => {
  try {
    const { planIndex } = req.params; // المؤشر الخاص بالخطة في المصفوفة
    const { name, type, price, description } = req.body; // البيانات الجديدة
    const user = req.user.id; // معرّف المستخدم

    // ✅ التحقق من وجود مدخلات محدثة
    if (!name && !type && !price && !description) {
      return next(
        new ApiError("At least one field must be provided to update", 400)
      );
    }

    // ✅ إنشاء كائن التحديث
    const updateFields = {};
    if (name) updateFields[`plans.${planIndex}.name`] = name;
    if (type) updateFields[`plans.${planIndex}.type`] = type;
    if (price) updateFields[`plans.${planIndex}.price`] = price;
    if (description)
      updateFields[`plans.${planIndex}.description`] = description;

    // ✅ تحديث الخطة باستخدام findOneAndUpdate
    const updatedProfile = await TrainerProfile.findOneAndUpdate(
      { user, [`plans.${planIndex}`]: { $exists: true } }, // التحقق من وجود الخطة بناءً على المؤشر
      { $set: updateFields },
      { new: true } // إرجاع الكائن بالكامل بعد التحديث
    );

    // ✅ التحقق من وجود الخطة
    if (!updatedProfile) {
      return next(new ApiError("Plan not found or invalid index", 404));
    }

    // ✅ إضافة المؤشر مع الخطة
    const updatedPlanWithIndex = {
      _id: planIndex, // إضافة المؤشر
      name: updatedProfile.plans[planIndex].name,
      type: updatedProfile.plans[planIndex].type,
      price: updatedProfile.plans[planIndex].price,
      description: updatedProfile.plans[planIndex].description,
    };

    // ✅ الاستجابة
    res.status(200).json({
      message: "Plan updated successfully",
      plan: updatedPlanWithIndex, // إرجاع الخطة مع المؤشر
    });
  } catch (error) {
    next(error);
  }
};

//@desc get MyPlans to Trainer Profile
//@route Get /api/v1/trainers/myPlans
//@access Private
exports.getMyTrainerProfilePlans = asyncHandler(async (req, res, next) => {
  const profile = await TrainerProfile.findOne({ user: req.user.id });
  if (!profile) {
    return next(new ApiError("Trainer profile not found", 404));
  }

  // إضافة المؤشر لكل خطة
  const plansWithIndex = profile.plans.map((plan, _id) => ({
    _id, // المؤشر الخاص بالخطة
    ...plan._doc, // نسخ بيانات الخطة
  }));

  res.status(200).json({ data: plansWithIndex });
});

//@desc get MyPlans to Trainer Profile
//@route Get /api/v1/trainers/myPlans
//@access Private
exports.removeSpecificPlanFromMyProfile = async (req, res, next) => {
  try {
    const { planIndex } = req.params; // المؤشر الخاص بالخطة
    const user = req.user.id; // معرّف المستخدم

    // ✅ التحقق من وجود الملف الشخصي للمدرب
    const profile = await TrainerProfile.findOne({ user });
    if (!profile) {
      return next(new ApiError("Trainer profile not found", 404));
    }

    // ✅ التحقق من وجود الخطة بناءً على المؤشر
    if (!profile.plans[planIndex]) {
      return next(new ApiError("Plan not found", 404));
    }

    // ✅ إزالة الخطة بناءً على الـ planIndex
    const removedPlan = profile.plans.splice(planIndex, 1)[0]; // إزالة الخطة والحصول عليها

    // ✅ تحديث الملف الشخصي بدون Trigger (من غير استخدام save() مع التحديث المباشر)
    await TrainerProfile.updateOne(
      { user },
      { $set: { plans: profile.plans } }
    );

    // ✅ إضافة المؤشر إلى الخطط المتبقية فقط
    const updatedPlansWithIndex = profile.plans.map((plan, index) => ({
      index: index.toString(), // إضافة المؤشر كـ string
      ...plan, // إضافة باقي تفاصيل الخطة
    }));

    // ✅ إرجاع الريسبونس مع الخطط المتبقية والمحددة بالمؤشر
    res.status(200).json({
      message: "Plan removed successfully",
      plans: updatedPlansWithIndex, // إرجاع الخطط مع المؤشر
    });
  } catch (error) {
    next(error);
  }
};

//@desc get My Subscribers to Trainer Profile
//@route Get /api/v1/trainers/mySubscribers
//@access Private
exports.getMyTrainerProfileSubscribers = asyncHandler(
  async (req, res, next) => {
    const profile = await TrainerProfile.findOne({ user: req.user.id });
    if (!profile) {
      return next(new ApiError("Trainer profile not found", 404));
    }

    res.status(200).json({ data: profile.subscribers });
  }
);
