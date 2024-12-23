const mongoose = require("mongoose");

const progressSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },
    volumes: [
      {
        volume: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  { timestamps: true }
);

// progressSchema.pre(/^find/, function (next) {
//   this.populate({ path: "userId", select: "username" })
//     .populate({ path: "exerciseId", select: "title" })
//   next();
// });

progressSchema.pre(/^find/, function (next) {
  this.populate({ path: "userId", select: "username" })
    .populate({ path: "exerciseId", select: "title" })
    .sort({ createdAt: -1 }); // Sort by createdAt in descending order
  next();
});

progressSchema.methods.toJSON = function () {
  const progress = this;
  const progressObject = progress.toObject();

  // استبدال `exerciseId` بـ `exercise` يحتوي على `_id` و `title`
  if (
    progress.exerciseId &&
    progress.exerciseId._id &&
    progress.exerciseId.title
  ) {
    progressObject.exercise = {
      _id: progress.exerciseId._id,
      title: progress.exerciseId.title,
    };
  }

  // إزالة الحقل الأصلي `exerciseId`
  delete progressObject.exerciseId;

  return progressObject;
};
const ProgressModel = mongoose.model("Progress", progressSchema);
module.exports = ProgressModel;
