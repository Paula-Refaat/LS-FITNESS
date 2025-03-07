const Progress = require("../models/progressModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const factory = require("./handllerFactory");
const TrainerProfile = require("../models/TrainerProfileModel");

// @desc Create a new progress entry
// @route POST /api/v1/progress
// @access private
exports.AddToProgress = asyncHandler(async (req, res, next) => {
  const { exerciseId, volume } = req.body;
  const userId = req.user.id;

  // التحقق مما إذا كان هناك سجل تقدم موجود مسبقًا
  const existsExerciseProgress = await Progress.findOne({ exerciseId, userId });

  if (existsExerciseProgress) {
    // تحديث السجل بإضافة حجم جديد باستخدام updateOne
    await Progress.updateOne(
      { exerciseId, userId },
      { $push: { volumes: { volume, date: Date.now() } } }
    );

    // جلب البيانات المحدثة
    const updatedProgress = await Progress.findOne({ exerciseId, userId })
      .populate("userId", "username")
      .populate("exerciseId", "title");

    const data = {
      _id: updatedProgress._id,
      user: {
        _id: updatedProgress.userId._id,
        username: updatedProgress.userId.username,
      },
      exercise: {
        _id: updatedProgress.exerciseId._id,
        title: updatedProgress.exerciseId.title,
      },
      volumes: updatedProgress.volumes,
    };

    return res.status(200).json({ success: true, data });
  }

  // إنشاء سجل تقدم جديد
  const newProgress = await Progress.create({
    exerciseId,
    userId,
    volumes: [{ volume, date: Date.now() }],
  });

  const newProgressPopulated = await Progress.findById(newProgress._id)
    .populate("userId", "username")
    .populate("exerciseId", "title");

  const data = {
    _id: newProgressPopulated._id,
    user: {
      _id: newProgressPopulated.userId._id,
      username: newProgressPopulated.userId.username,
    },
    exercise: {
      _id: newProgressPopulated.exerciseId._id,
      title: newProgressPopulated.exerciseId.title,
    },
    volumes: newProgressPopulated.volumes,
  };

  res.status(201).json({ success: true, data });
});

exports.createFilterObj = async (req, res, next) => {
  try {
    let filterObject = {};
    const { userId } = req.body;
    const { exerciseId } = req.params;

    if (!exerciseId)
      return next(new ApiError("You must provide an exerciseId", 400));

    if (req.user.role === "admin" || req.user.role === "sub-admin") {
      if (!userId) return next(new ApiError("You must provide a userId", 400));
      filterObject = { exerciseId, userId };
    } else if (req.user.role === "trainer" || req.user.role === "Ls-trainer") {
      if (!userId) return next(new ApiError("You must provide a userId", 400));

      const trainerProfile = await TrainerProfile.findOne({
        user: req.user.id,
      });
      if (!trainerProfile)
        return next(new ApiError("You don't have a trainer profile", 400));

      const isSubscribed = trainerProfile.subscribers?.some(
        (subscriber) => subscriber.user._id.toString() === userId
      );

      if (!isSubscribed) {
        return next(
          new ApiError(
            "You do not have permission to see this trainee's progress",
            403
          )
        );
      }

      filterObject = { exerciseId, userId };
    } else {
      filterObject = { exerciseId, userId: req.user.id };
    }

    req.filterObj = filterObject;
    next();
  } catch (error) {
    next(error);
  }
};

exports.getMyProgressByExerciseId = factory.getAll(Progress);
