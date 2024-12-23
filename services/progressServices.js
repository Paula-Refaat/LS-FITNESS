const Progress = require("../models/progressModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const factory = require("./handllerFactory");
// @desc Create a new progress entry
// @route POST /api/v1/progress
// @access private
// exports.AddToProgress = asyncHandler(async (req, res, next) => {
//   const { exerciseId, volume } = req.body;
//   const userId = req.user.id;

//   // Check if the progress for the exercise and user already exists
//   const existsExerciseProgress = await Progress.findOne({ exerciseId, userId });

//   if (existsExerciseProgress) {
//     // Update the progress by pushing the new volume
//     await Progress.updateOne(
//       { exerciseId, userId },
//       { $push: { volumes: volume } }
//     );

//     const data = {
//       _id: existsExerciseProgress._id,
//       user: {
//         _id: existsExerciseProgress.userId._id,
//         username: existsExerciseProgress.userId.username,
//       },
//       exercise: {
//         _id: existsExerciseProgress._id,
//         title: existsExerciseProgress.exerciseId.title,
//       },
//       volumes: existsExerciseProgress.volumes,
//     };

//     // Send the updated document as a response
//     return res.status(200).json({ success: true, data: data });
//   }
//   // Create a new progress entry
//   const newProgress = await Progress.create({
//     exerciseId,
//     userId,
//     volumes: [volume],
//   });
//   const newProgressPopulated = await newProgress.populate("userId exerciseId");
//   const data = {
//     _id: newProgressPopulated._id,
//     user: {
//       _id: newProgressPopulated.userId._id,
//       username: newProgressPopulated.userId.username,
//     },
//     exercise: {
//       _id: newProgressPopulated._id,
//       title: newProgressPopulated.exerciseId.title,
//     },
//     volumes: newProgressPopulated.volumes,
//   };
//   res.status(201).json({ success: true, data: data });
// });

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

// @desc Get progress by exerciseId
// @route GET /api/v1/progress/:exerciseId
// @access private
// exports.getMyProgressByExerciseId = asyncHandler(async (req, res, next) => {
//   const userId = req.user.id;
//   const { exerciseId } = req.params;
//   const progress = await Progress.findOne({ userId, exerciseId });
//   if (!progress) {
//     return res
//       .status(404)
//       .json({ success: false, message: "Progress not found" }); // Progress not found for the given exerciseId and userId
//   }
//   const data = {
//     _id: progress._id,
//     user: {
//       _id: progress.userId._id,
//       username: progress.userId.username,
//     },
//     exercise: {
//       _id: progress._id,
//       title: progress.exerciseId.title,
//     },
//     volumes: progress.volumes,
//   };

//   res.status(200).json({
//     success: true,
//     data: data,
//   });
// });

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};

  if (req.params.exerciseId) {
    if (req.user.role === "admin") {
      filterObject = { exerciseId: req.params.exerciseId };
    } else {
      filterObject = { exerciseId: req.params.exerciseId, userId: req.user.id };
    }
  }

  req.filterObj = filterObject;
  next();
};

exports.getMyProgressByExerciseId = factory.getAll(Progress);

// @desc Get all progress for a user
// @route GET /api/v1/progress
//  @access private
exports.getMyProgress = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const progress = await Progress.find({ userId });

  res.status(200).json({
    success: true,
    data: progress,
  });
});
